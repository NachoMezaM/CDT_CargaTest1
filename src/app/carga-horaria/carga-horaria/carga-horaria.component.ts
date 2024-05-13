import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { BarranavegacionComponent } from '../../barranavegacion/barranavegacion.component';
import { response } from 'express';

@Component({
  selector: 'app-carga-horaria',
  templateUrl: './carga-horaria.component.html',
  styleUrls: ['./carga-horaria.component.css'],
  standalone: true,
  imports: [BarranavegacionComponent],
})
export class CargaHorariaComponent {
  asignaturas: any[] = [];
  totalHoras: number = 0;
  totalMinutos: number = 0;
  currentYear: number | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Obtener el año actual al inicializar el componente
    this.currentYear = new Date().getFullYear();
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    // Verificar si el foco está en uno de los campos de entrada antes de ejecutar la búsqueda
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA')
    ) {
      this.buscarDatos();
    }
  }

  limpiarPagina() {
    // Limpiar los campos del formulario
    (document.getElementById('nombre') as HTMLInputElement).value = '';
    (document.getElementById('rut') as HTMLInputElement).value = '';
    (document.getElementById('grado') as HTMLElement).innerText = '';
    (document.getElementById('jerarquizacion') as HTMLElement).innerText = '';
    (document.getElementById('horascontrato') as HTMLElement).innerText = '';
    (
      document.getElementById('PosibleHorasDeDocencia') as HTMLElement
    ).innerText = '';

    // Limpiar la tabla de asignaturas
    const tbody = document.getElementById('asignaturas-body');
    if (tbody) {
      tbody.innerHTML = '';
    }
  }

  buscarDatos() {
    const rut = (document.getElementById('rut') as HTMLInputElement).value;
    const nombre = (
      document.getElementById('nombre') as HTMLInputElement
    ).value.trim();
    const año = (document.getElementById('año') as HTMLInputElement).value;

    this.http
      .post<any>('http://localhost:3000/buscar-datos', { rut, nombre, año })
      .subscribe(
        (response) => {
          console.log('Datos encontrados:', response);
          // Verificar si la respuesta es un array y contiene al menos un elemento
          if (Array.isArray(response) && response.length > 0) {
            // Buscar el resultado que coincide con el rut buscado o el nombre y apellido
            const data = response.find(
              (item) =>
                item.idProfesor === rut ||
                item.Nombre + ' ' + item.Apellido === nombre
            );
            if (data) {
              // Concatenar nombre y apellido
              const nombreCompleto = data.Nombre + ' ' + data.Apellido;
              let jerarquia = '';
              switch (data.idJerarquia) {
                case 1:
                  console.log('Caso: MAGISTER');
                  jerarquia = 'Instructor';
                  break;
                case 2:
                  console.log('Caso: LICENCIADO');
                  jerarquia = 'Asistente';
                  break;
                case 3:
                  console.log('Caso: DOCTORADO');
                  jerarquia = 'Asociado';
                  break;
                case 4:
                  console.log('Caso: Default');
                  jerarquia = 'Titular';
                  break;
              }
              // Actualizar los campos del formulario con los datos encontrados
              (document.getElementById('nombre') as HTMLInputElement).value =
                nombreCompleto;
              (document.getElementById('rut') as HTMLInputElement).value =
                data.idProfesor;
              document.getElementById('grado')!.innerText = data.Grado;
              document.getElementById('jerarquizacion')!.innerText = jerarquia;
              document.getElementById('horascontrato')!.innerText = data.Horas;
              // Aquí obtenemos las horas máximas de docencia desde la tabla jerarquia
              this.obtenerHoraMaximaDocencia(data.idJerarquia);
            } else {
              console.error(
                'No se encontraron registros con el rut o nombre/apellido proporcionados.'
              );
            }
          } else {
            console.error(
              'La respuesta del servidor no es un array o está vacía.'
            );
          }
        },
        (error) => {
          console.error('Error al buscar datos:', error);
        }
      );
    this.buscarDatosProfesor();
    // Después de buscar los datos exitosamente, llamar a la función limpiarPagina()
    this.limpiarPagina();
  }

  obtenerHoraMaximaDocencia(idJerarquia: string) {
    this.http
      .get<any>(
        `http://localhost:3000/obtener-hora-maxima-docencia/${idJerarquia}`
      )
      .subscribe(
        (response) => {
          if (response && response.horaMaximaDeDocencia) {
            document.getElementById('PosibleHorasDeDocencia')!.innerText =
              response.horaMaximaDeDocencia;
          } else {
            console.error('No se encontraron las horas máximas de docencia.');
          }
        },
        (error) => {
          console.error(
            'Error al obtener las horas máximas de docencia:',
            error
          );
        }
      );
  }

  filasIndirecta: any = []; // Array para almacenar las filas de la tabla de docencia indirecta

  //Docencia Directa

  // Método para agregar una fila a la tabla de docencia directa
  agregarFila() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement)
      .value;
    const seccion = (document.getElementById('seccion') as HTMLSelectElement)
      .value;
    const rut = (document.getElementById('rut') as HTMLInputElement).value;
    const año = (document.getElementById('año') as HTMLInputElement).value;

    this.http
      .get<any>(
        `http://localhost:3000/detalles-asignatura/${codigo}/${seccion}`
      )
      .subscribe(
        (data) => {
          const tbody = document.getElementById('asignaturas-body');
          if (!tbody) {
            console.error('No se encontró el elemento tbody.');
            return;
          }
          const newRow = document.createElement('tr');
          const horas = parseInt(data.Horas);
          const minutos = horas * 45; // Calcular los minutos
          const planificacion = Math.floor(minutos / 60); // Calcular las horas

          newRow.innerHTML = `
          <td>${codigo}</td>
          <td>${seccion}</td>
          <td>${data.Nombre}</td>
          <td>${data.Horas}</td>
          <td>${minutos}</td>
          <td>${planificacion}</td>
          <td></td>
          <td><input type="checkbox" class="confirm-checkbox"></td>
          <td><label class="remove-checkbox">✘</label></td>
        `;
          tbody.appendChild(newRow);

          // Centrar el texto en todas las celdas de la nueva fila
          const cells = newRow.querySelectorAll('td');
          cells.forEach((cell) => {
            cell.style.textAlign = 'center';
          });

          // Agregar el evento de clic a la "x" para eliminar la fila
          const removeLabel = newRow.querySelector('.remove-checkbox');
          if (removeLabel) {
            removeLabel.addEventListener('click', () => {
              this.eliminarFila1(newRow);
              this.actualizarBotonGuardar();
            });
          }

          // Agregar el evento de clic al botón de eliminación
          const deleteButton = newRow.querySelector('.remove-btn');
          if (deleteButton) {
            deleteButton.addEventListener('click', () => {
              this.eliminarFila1(newRow);
              this.actualizarBotonGuardar();
            });
          }

          // Agregar el evento de cambio al checkbox de confirmación
          const confirmCheckbox = newRow.querySelector(
            '.confirm-checkbox'
          ) as HTMLInputElement;
          if (confirmCheckbox) {
            confirmCheckbox.addEventListener('change', () => {
              this.actualizarBotonGuardar();
            });
          }
        },
        (error) => {
          console.error(
            'Error al obtener los detalles de la asignatura:',
            error
          );
          alert(
            'Ocurrió un error al obtener los detalles de la asignatura. Por favor, inténtalo de nuevo más tarde.'
          );
        }
      );
  }

  actualizarBotonGuardar() {
    const checkboxes = document.querySelectorAll(
      '.confirm-checkbox'
    ) as NodeListOf<HTMLInputElement>;
    let alMenosUnoMarcado = false;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        alMenosUnoMarcado = true;
      }
    });

    const guardarButton = document.getElementById(
      'guardar-button'
    ) as HTMLButtonElement;
    if (guardarButton) {
      guardarButton.disabled = !alMenosUnoMarcado;
    }
  }

  guardarDatos() {
    const idProfesor = (document.getElementById('rut') as HTMLInputElement).value;
    const año = (document.getElementById('año') as HTMLInputElement).value;
  
    const filas = document.querySelectorAll('#asignaturas-body tr');
    let algunaFilaGuardada = false; // Variable para controlar si al menos una fila se guardó con éxito
    filas.forEach((fila) => {
      const checkbox = fila.querySelector('.confirm-checkbox') as HTMLInputElement;
      if (checkbox.checked) {
        const columnas = fila.querySelectorAll('td');
        const codigo = columnas[0].innerText;
        const seccion = columnas[1].innerText;
        const planificacion = parseInt(columnas[5].innerText);
        const minutos = parseInt(columnas[4].innerText);
  
        this.guardarCargaDocente(idProfesor, `${codigo}${seccion}`, planificacion, minutos, año)
          .then((guardado) => {
            if (guardado) {
              algunaFilaGuardada = true;
            }
          });
      }
    });
  
    // Mostrar mensaje dependiendo de si se guardó al menos una fila o no
    if (algunaFilaGuardada) {
      alert('Se guardaron las filas correctamente.');
      this.limpiarFilasGuardadas();
    } else {
      alert('No se guardaron filas duplicadas.');
    }

    // Limpiar las filas guardadas después de guardar
    this.limpiarFilasGuardadas();
  }

  limpiarFilasGuardadas() {
    const filasGuardadas = document.querySelectorAll('#asignaturas-body tr');
    filasGuardadas.forEach((fila) => {
      const checkbox = fila.querySelector(
        '.confirm-checkbox'
      ) as HTMLInputElement;
      if (checkbox.checked) {
        fila.remove();
      }
    });
  }

  guardarCargaDocente(idProfesor: string, idAsignaturaSeccion: string, planificacion: number, minutos: number, año: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .post<any>('http://localhost:3000/guardar-carga-docente', {
          idProfesor,
          idAsignaturaSeccion,
          HorasPlanificacion: planificacion,
          Horas_Minutos: minutos,
          Anio: año,
        })
        .subscribe(
          (data) => {
            console.log('Carga docente guardada exitosamente:', data);
            resolve(true); // Indicar que la fila se guardó con éxito
          },
          (error) => {
            console.error('Error al guardar la carga docente:', error);
            if (error.status === 400 && error.error.message === 'No se guardaron filas duplicadas') {
              resolve(false); // Indicar que la fila no se guardó debido a duplicados
            } else {
              alert('Ocurrió un error al guardar la carga docente. Por favor, inténtalo de nuevo más tarde.');
              reject(error);
            }
          }
        );
    });
  }

  eliminarFila1(row: HTMLElement) {
    // Remover la fila del DOM
    if (row.parentNode) {
      row.parentNode.removeChild(row);
    }
  }

  eliminarFila(row: HTMLElement) {
    // Obtener los datos necesarios para identificar la fila
    const codigo = (row.querySelector('td:nth-child(1)') as HTMLElement)
      .innerText;
    const seccion = (row.querySelector('td:nth-child(2)') as HTMLElement)
      .innerText;

    // Realizar una solicitud POST al servidor para eliminar la fila
    this.http
      .post<any>('http://localhost:3000/eliminar-fila', { codigo, seccion })
      .subscribe(
        (data) => {
          // Manejar la respuesta del servidor
          console.log('Respuesta del servidor:', data);
          if (data && data.message === 'Fila eliminada exitosamente') {
            console.log('Fila eliminada exitosamente:', data);
            // Eliminar la fila del DOM si se eliminó con éxito de la base de datos
            if (row.parentNode) {
              row.parentNode.removeChild(row);
            }
          } else {
            console.error('Error al eliminar la fila:', data);
            alert(
              'Ocurrió un error al eliminar la fila en la base de datos. Por favor, inténtalo de nuevo más tarde.'
            );
          }
        },
        (error) => {
          console.error('Error al eliminar la fila:', error);
          alert(
            'Ocurrió un error al eliminar la fila. Por favor, inténtalo de nuevo más tarde.'
          );
        }
      );
  }

  buscarDatosProfesor() {
    const rut = (document.getElementById('rut') as HTMLInputElement).value;

    this.http
      .post<any>('http://localhost:3000/buscar-datos-profesor', { rut })
      .subscribe(
        (data) => {
          const tbody = document.getElementById('asignaturas-body');
          if (!tbody) {
            console.error('No se encontró el elemento tbody.');
            return;
          }
          // Limpiar la tabla antes de agregar nuevos datos
          tbody.innerHTML = '';

          // Iterar sobre los datos y agregar una fila por cada resultado
          data.forEach(
            (profesor: {
              HorasPlanificacion: string;
              Horas_Minutos: string;
              idAsignatura: string;
              idSeccion: string;
              Nombre: any;
              Horas: any;
            }) => {
              const newRow = document.createElement('tr');
              const horas = parseInt(profesor.HorasPlanificacion);
              const minutos = parseInt(profesor.Horas_Minutos); // Se obtienen los minutos directamente
              const planificacion = Math.floor(minutos / 60); // Calcular las horas

              newRow.innerHTML = `
              <td>${profesor.idAsignatura}</td>
              <td>${profesor.idSeccion}</td>
              <td>${profesor.Nombre}</td>
              <td>${profesor.Horas}</td>
              <td>${minutos}</td>
              <td>${planificacion}</td>
              <td></td>
              <td><input type="checkbox" class="confirm-checkbox"></td>
              <td><label class="remove-checkbox">✘</label></td>
            `;
              tbody.appendChild(newRow);

              // Centrar el texto en todas las celdas de la nueva fila
              const cells = newRow.querySelectorAll('td');
              cells.forEach((cell) => {
                cell.style.textAlign = 'center';
              });

              // Agregar el evento de clic a la "x" para eliminar la fila
              const removeLabel = newRow.querySelector('.remove-checkbox');
              if (removeLabel) {
                removeLabel.addEventListener('click', () => {
                  this.eliminarFila(newRow);
                  this.actualizarBotonGuardar();
                });
              }
              // Agregar el evento de clic al botón de eliminación
              const deleteButton = newRow.querySelector('.remove-btn');
              if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                  this.eliminarFila(newRow);
                  this.actualizarBotonGuardar();
                });
              }

              // Agregar el evento de cambio al checkbox de confirmación
              const confirmCheckbox = newRow.querySelector(
                '.confirm-checkbox'
              ) as HTMLInputElement;
              if (confirmCheckbox) {
                confirmCheckbox.addEventListener('change', () => {
                  this.actualizarBotonGuardar();
                });
              }
            }
          );
        },
        (error) => {
          console.error('Error al buscar datos del profesor:', error);
        }
      );
  }

  limpiarTabla() {
    const tbody = document.getElementById('asignaturas-body');
    if (tbody) {
      tbody.innerHTML = ''; // Limpiar el contenido del tbody
    }
  }

  //Docencia Directa

  // Método para buscar las secciones disponibles para un código de asignatura dado
  buscarSecciones() {
    const codigo = (document.getElementById('codigo') as HTMLInputElement)
      .value;

    this.http
      .post<any>('http://localhost:3000/obtener-secciones', { codigo })
      .subscribe(
        (data) => {
          const seccionSelect = document.getElementById(
            'seccion'
          ) as HTMLSelectElement;
          seccionSelect.innerHTML = ''; // Limpiar opciones anteriores
          if (Array.isArray(data)) {
            data.forEach((Seccion) => {
              const option = document.createElement('option');
              option.value = Seccion.idSeccion;
              option.textContent = Seccion.idSeccion;
              seccionSelect.appendChild(option);
            });
          } else {
            console.error('La respuesta del servidor no es un array:', data);
          }
        },
        (error) => {
          console.error('Error al obtener secciones:', error);
          alert(
            'Ocurrió un error al obtener las secciones. Por favor, inténtalo de nuevo más tarde.'
          );
        }
      );
  }
}