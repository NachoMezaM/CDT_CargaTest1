import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { BarranavegacionComponent } from '../../barranavegacion/barranavegacion.component';
import { response } from 'express';
import { RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map, catchError, throwError } from 'rxjs';
import { parse } from 'node:path';

@Component({
  selector: 'app-carga-horaria',
  templateUrl: './carga-horaria.component.html',
  styleUrls: ['./carga-horaria.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    BarranavegacionComponent,
  ],
})
export class CargaHorariaComponent implements AfterViewInit {
  asignaturas: any[] = [];
  totalHoras: number = 0;
  totalMinutos: number = 0;
  currentYear: number | undefined;
  datosAdministrativos: any;
  idProfesor!: string;
  carga!: string;
  horas!: number;
  minutos!: number;
  rut!: string;
  notas: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarTrabajosAdministrativos();
    // Obtener el año actual al inicializar el componente
    this.currentYear = new Date().getFullYear();

    // Agregar el evento input para transformar el texto a mayúsculas
    const codigoInput = document.getElementById('codigo') as HTMLInputElement;
    if (codigoInput) {
      codigoInput.addEventListener('input', this.transformarAMayusculas);
    }

    const rutInput = document.getElementById('rut') as HTMLInputElement;
    rutInput.addEventListener('input', () => {
      const rut = rutInput.value;
      this.buscarDatosAdministrativos(rut);
    });

    const guardarButton = document.getElementById(
      'guardar-button'
    ) as HTMLButtonElement;
    if (guardarButton) {
      guardarButton.addEventListener('click', () => {
        this.guardarDatosAdministrativos();
      });
    }
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

  @HostListener('keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
    // Prevenir la actualización de la página
    event.preventDefault();

    const target = event.target as HTMLInputElement;
    if (target.id === 'codigo') {
      this.buscarSecciones();
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
    // const tbodyAdmin = document.getElementById('carga-administrativa-body');
    // if (tbodyAdmin) {
    //   tbodyAdmin.innerHTML='';
    // }
  }

  //-------------------------------------Ingresar Carga----------------------------------------------
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
          //console.log('Datos encontrados:', response);
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
                  jerarquia = 'Instructor';
                  break;
                case 2:
                  jerarquia = 'Asistente';
                  break;
                case 3:
                  jerarquia = 'Asociado';
                  break;
                case 4:
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
    this.limpiarPagina();
    this.agregarFilaAdministrativa(rut);
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

  //-----------------------Docencia Directa----------------------------------------

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
          const planificacion = Math.floor(minutos); // Calcular las horas
          const totalHoras = Math.floor(minutos + planificacion);

          newRow.innerHTML = `
          <td>${codigo}</td>
          <td>${seccion}</td>
          <td>${data.Nombre}</td>
          <td>${data.Horas}</td>
          <td>${minutos}</td>
          <td>${planificacion}</td>
          <td>${totalHoras}</td>
          <td><input type="checkbox" class="confirm-checkbox"></td>
          <td><label class="remove-checkbox">✘</label></td>`;
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

  transformarAMayusculas(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
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
    const idProfesor = (document.getElementById('rut') as HTMLInputElement)
      .value;
    const año = (document.getElementById('año') as HTMLInputElement).value;

    const filas = document.querySelectorAll('#asignaturas-body tr');
    let algunaFilaGuardada = false; // Variable para controlar si al menos una fila se guardó con éxito

    filas.forEach((fila) => {
      const checkbox = fila.querySelector(
        '.confirm-checkbox'
      ) as HTMLInputElement;
      if (checkbox.checked) {
        const columnas = fila.querySelectorAll('td');
        const codigo = columnas[0].innerText;
        const seccion = columnas[1].innerText;
        const planificacion = parseInt(columnas[5].innerText);
        const minutos = parseInt(columnas[4].innerText);

        this.guardarCargaDocente(
          idProfesor,
          `${codigo}${seccion}`,
          planificacion,
          minutos,
          año
        ).then((guardado) => {
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
      // alert('No se guardaron filas duplicadas.');
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

  guardarCargaDocente(
    idProfesor: string,
    idAsignaturaSeccion: string,
    planificacion: number,
    minutos: number,
    año: string
  ): Promise<boolean> {
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
            if (
              error.status === 400 &&
              error.error.message === 'No se guardaron filas duplicadas'
            ) {
              resolve(false); // Indicar que la fila no se guardó debido a duplicados
            } else {
              alert('fila o filas duplicadas.');
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
    const rut = (document.getElementById('rut') as HTMLInputElement).value;

    // Realizar una solicitud POST al servidor para eliminar la fila
    this.http
      .post<any>('http://localhost:3000/eliminar-fila', {
        codigo,
        seccion,
        rut,
      })
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
              const planificacion = Math.floor(minutos); // Calcular las horas
              const totalMinutos = Math.floor(minutos + planificacion);

              newRow.innerHTML = `
          <td>${profesor.idAsignatura}</td>
          <td>${profesor.idSeccion}</td>
          <td>${profesor.Nombre}</td>
          <td>${profesor.Horas}</td>
          <td>${minutos}</td>
          <td>${planificacion}</td>
          <td>${totalMinutos}</td>
          <td><input type="checkbox" class="confirm-checkbox" disabled></td>
          <td><label class="remove-checkbox">✘</label></td>`;
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

          // Agregar opción predeterminada "Seleccionar"
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = 'Seleccionar';
          defaultOption.disabled = true;
          defaultOption.selected = true;
          seccionSelect.appendChild(defaultOption);

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

  //----------------------------------Carga Administrativa---------------------------

  agregarFilaAdministrativa(rut: string) {
    this.buscarDatosAdministrativos(rut).subscribe((response) => {
      console.log('Datos recibidos:', response);
      const tbody = document.getElementById('carga-administrativa-body');
      if (!tbody) {
        console.error(
          'No se encontró el elemento tbody para carga administrativa.'
        );
        return;
      }

      tbody.innerHTML = '';

      response.forEach((item: { carga: any; horas: any; minutos: any }) => {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
          <td>${item.carga}</td>
          <td>${item.horas}</td>
          <td>${item.minutos}</td>
          <td><input type="checkbox" class="confirm-checkbox" disabled></td>
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
            this.eliminarFilaAdministrativa1(newRow);
            this.actualizarBotonGuardar();
          });
        }
      });
    });
  }

  agregarFilaAdministrativa1() {
    const CargaInput = document.getElementById('Carga') as HTMLInputElement;
    const HorasInput = document.getElementById('Horas') as HTMLInputElement;

    this.http
      .get<any>('http://localhost:3000/trabajos-administrativos')
      .subscribe((data) => {
        const tbody = document.getElementById('carga-administrativa-body');
        if (!tbody) {
          console.error(
            'No se encontró el elemento tbody para carga administrativa.'
          );
          return;
        }
        const newRow = document.createElement('tr');
        const Carga = CargaInput.value;
        const Horas = parseInt(HorasInput.value);
        const minutos = Horas * 60; // Calcular los minutos

        newRow.innerHTML = `
          <td>${Carga}</td>
          <td>${Horas}</td>
          <td>${minutos}</td>
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
            this.eliminarFilaAdministrativa(newRow);
            this.actualizarBotonGuardar();
          });
        }

        // Agregar el evento de cambio al checkbox de confirmación
        const confirmCheckbox = newRow.querySelector('.confirm-checkbox') as HTMLInputElement;
        if (confirmCheckbox) {
          confirmCheckbox.addEventListener('change', () => {
            this.actualizarBotonGuardar();
          });
        }
      });
  }

  buscarDatosAdministrativos(rut: string) {
    return this.http.get<any>(`http://localhost:3000/buscar-datos-administrativos/${rut}`)
    .pipe( map((response: any) => { console.log('Datos recibidos:', response);
          return response;
        }),
        catchError((error: any) => {
          console.error('Error al buscar datos:', error);
          return throwError(error);
        })
      );
  }

  guardarDatosAdministrativos() {
    const idProfesor = (document.getElementById('rut') as HTMLInputElement).value;
    const filaAdministrativa = document.querySelectorAll('#carga-administrativa-body tr');
    const promesas: any[] = [];

    filaAdministrativa.forEach((filaA) => {
      const checkbox = filaA.querySelector('.confirm-checkbox') as HTMLInputElement;
      if (checkbox.checked) {
        const columnas = filaA.querySelectorAll('td');
        const Carga = columnas[0].innerText; // Ajuste el índice si es necesario
        const Hora = parseInt(columnas[1].innerText); // Ajuste el índice si es necesario
        const Hora_Minutos = parseInt(columnas[2].innerText); // Ajuste el índice si es necesario
        console.log(Carga);
        let carga = 0;
        switch (Carga) {
          case 'Claustro':
            carga = 1;
            break;
          case 'Planificación':
            carga = 2;
            break;
          case 'Clases':
            carga = 3;
            break;
          case 'Administrativo':
            carga = 4;
            break;
          case 'Contrato':
            carga = 5;
            break;
        }
        if (Carga) {
          // Verifica que idTrabajoAdministrativo no sea null
          const promesa = this.guardarCargaAdministrativa(idProfesor, carga, Hora, Hora_Minutos);
          promesas.push(promesa);
        } else {
          console.error('idTrabajoAdministrativo es null o undefined');
        }
      }
    });
  }

  guardarCargaAdministrativa(idProfesor: string,carga: number,Hora: number,Hora_Minutos: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<any>('http://localhost:3000/guardar-carga-administrativa', {idProfesor, carga, Hora, Hora_Minutos,})
        .subscribe(
          (data) => {
            console.log('Carga administrativa guardada exitosamente:', data);
            resolve(true);
          },
          (error) => {
            console.error('Error al guardar la carga administrativa:', error);
            reject(error);
          }
        );
    });
  }

  cargarTrabajosAdministrativos() {
    this.http.get<any[]>('http://localhost:3000/trabajos-administrativos')
      .subscribe(
        (data) => {
          const selectElement = document.getElementById('Carga') as HTMLSelectElement;

          // Agregar la opción "Seleccionar" al principio del select
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.text = 'Seleccionar';
          defaultOption.disabled = true;
          defaultOption.selected = true;
          selectElement.appendChild(defaultOption);

          data.forEach((trabajo) => {
            const option = document.createElement('option');
            option.value = trabajo.carga;
            option.text = trabajo.carga;
            selectElement.appendChild(option);
          });
        },
        (error) => {
          console.error('Error al cargar trabajos administrativos:', error);
        }
      );
  }

  eliminarFilaAdministrativa(row: HTMLElement) {
    if (row.parentNode) {
      row.parentNode.removeChild(row);
    }
  }

  eliminarFilaAdministrativa1(row: HTMLElement) {
    // Obtener los datos necesarios para identificar la fila
    const carga = (row.querySelector('td:nth-child(1)') as HTMLElement).innerText;
    const rut = (document.getElementById('rut') as HTMLInputElement).value;

    if (!carga || !rut) {
      alert('Error: Carga y RUT son requeridos para eliminar la fila.');
      return;
    }

    // Realizar una solicitud POST al servidor para eliminar la fila
    this.http.post<any>('http://localhost:3000/eliminar-carga-administrativa', {carga, rut,})
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
            alert('No se encontró la fila para eliminar.');
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

  limpiarTablaCargaAdministrativa() {
    const tbody = document.getElementById('carga-administrativa-body');
    if (tbody) {
      tbody.innerHTML = ''; // Limpiar el contenido del tbody
    }
  }

  //-------------------------------Notas-------------------------------

  @ViewChild('floatingButton') floatingButton!: ElementRef;
  @ViewChild('popup') popup!: ElementRef;
  @ViewChild('closePopupButton') closePopupButton!: ElementRef;
  @ViewChild('Notas') Notas!: ElementRef;

  ngAfterViewInit(): void {
    if (this.floatingButton && this.popup && this.closePopupButton) {
      this.floatingButton.nativeElement.addEventListener('click', () => {
        this.popup.nativeElement.style.display = 'block';
      });
      this.closePopupButton.nativeElement.addEventListener('click', () => {
        this.popup.nativeElement.style.display = 'none';
      });
      this.Notas.nativeElement.addEventListener(
        'input',
        this.adjustTextareaHeight.bind(this)
      );
    } else {
      console.error('Error: Uno o más elementos HTML no se encontraron');
    }
  }

  private adjustTextareaHeight(): void {
    const textarea = this.Notas.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
