import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { BarranavegacionComponent } from "../barranavegacion/barranavegacion.component";

@Component({
    selector: 'app-carga-horaria',
    templateUrl: './carga-horaria.component.html',
    styleUrls: ['./carga-horaria.component.css'],
    standalone: true,
    imports: [BarranavegacionComponent]
})
export class CargaHorariaComponent {
  asignaturas: any[] = [];
  constructor(private http: HttpClient) {}

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
              // Actualizar los campos del formulario con los datos encontrados
              (document.getElementById('nombre') as HTMLInputElement).value =
                nombreCompleto;
              (document.getElementById('rut') as HTMLInputElement).value =
                data.idProfesor;

              console.log('Grado obtenido de la base de datos:', data.Grado);
              console.log('Valor de data.Grado antes del switch:', data.Grado);
              console.log('Tipo de data.Grado:', typeof data.Grado);
              console.log('Contenido de data.Grado:', data.Grado);
              // Actualizar el campo "Grado" según el valor obtenido de la base de datos
              let grado = '';
              switch (data.Grado.toUpperCase()) {
                case 'M':
                  console.log('Caso: M');
                  grado = 'Magister';
                  break;
                case 'L':
                  console.log('Caso: L');
                  grado = 'Licenciado';
                  break;
                case 'D':
                  console.log('Caso: D');
                  grado = 'Doctorado';
                  break;
                default:
                  console.log('Caso: Default');
                  grado = 'No especificado';
                  break;
              }
              console.log('Grado actualizado:', grado);

              document.getElementById('grado')!.innerText = grado;
              document.getElementById('jerarquizacion')!.innerText =
                data.NombreJ;
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
  const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
  const seccion = (document.getElementById('seccion') as HTMLSelectElement).value;

  this.http.get<any>(`http://localhost:3000/detalles-asignatura/${codigo}/${seccion}`)
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
        newRow.innerHTML = `
          <td>${codigo}</td>
          <td>${seccion}</td>
          <td>${data.Nombre}</td>
          <td>${data.Horas}</td>
          <td>${minutos}</td>
          <td><button type="button" class="remove-btn">Eliminar</button></td>
        `;
        tbody.appendChild(newRow);

        // Centrar el texto en todas las celdas de la nueva fila
        const cells = newRow.querySelectorAll('td');
        cells.forEach(cell => {
          cell.style.textAlign = 'center';
        });

        // Agregar el evento de clic al botón de eliminación
        const deleteButton = newRow.querySelector('.remove-btn');
        if (deleteButton) {
          deleteButton.addEventListener('click', () => {
            this.eliminarFila(newRow);
            this.calcularTotalHorasMinutos();
          });
        }

        // Llamar a la función para agregar fila y calcular en la tabla de docencia indirecta
        this.agregarFilaIndirecta(data.Nombre, minutos);
      },
      (error) => {
        console.error('Error al obtener los detalles de la asignatura:', error);
        alert('Ocurrió un error al obtener los detalles de la asignatura. Por favor, inténtalo de nuevo más tarde.');
      }
    );
}

  //Docencia Indirecta

// Método para agregar una fila a la tabla de docencia indirecta
agregarFilaIndirecta(concepto: string, minutos: number) {
  const horas = Math.floor(minutos / 60); // Calcular las horas
  const Minutos = minutos ; // Calcular los minutos restantes
  
  // Crear la fila HTML con los datos obtenidos
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${concepto}</td>
    <td>${horas}</td>
    <td>${Minutos}</td>
    <td><button type="button" class="remove-btn">Eliminar</button></td>
  `;
  
  // Agregar la fila a la tabla de docencia indirecta
  const tbody = document.getElementById('asignaturas-body-indirecta');
  if (tbody) {
    tbody.appendChild(newRow);
  } else {
    console.error('No se encontró el elemento tbody de la tabla de docencia indirecta.');
  }
  
  // Centrar el texto en todas las celdas de la nueva fila
  const cells = newRow.querySelectorAll('td');
  cells.forEach(cell => {
    cell.style.textAlign = 'center';
  });
  
  // Agregar el evento de clic al botón de eliminación
  const deleteButton = newRow.querySelector('.remove-btn');
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      this.eliminarFila(newRow);
    });
  }
}

  eliminarFilaIndirecta(index: number) {
    try {
      console.log('Eliminando fila:', index);
      this.filasIndirecta.splice(index, 1);
      console.log('Filas actualizadas:', this.filasIndirecta);
    } catch (error) {
      console.error('Error al eliminar fila:', error);
    }
  }

  eliminarFila(row: HTMLElement) {
    // Verifica si la fila es válida
    if (!row || !row.parentNode) {
      console.error('Fila no válida o no tiene un nodo padre.');
      return;
    }
  
    // Elimina la fila del DOM
    row.parentNode.removeChild(row);
  }

  // Nuevo código TypeScript para calcular el total de horas y minutos
  calcularTotalHorasMinutos() {
    let totalHoras = 0;
    let totalMinutos = 0;
    const filas = document.querySelectorAll('#asignaturasTable tbody tr');
    filas.forEach((fila) => {
      const horasInput = fila.querySelector(
        'input[name="horas"]'
      ) as HTMLInputElement;
      const minutosInput = fila.querySelector(
        'input[name="minutos"]'
      ) as HTMLInputElement;
      if (horasInput && minutosInput) {
        totalHoras += parseInt(horasInput.value) || 0;
        totalMinutos += parseInt(minutosInput.value) || 0;
      }
    });

    // Actualizar los elementos span con los totales calculados
    const totalHorasSpan = document.getElementById('totalHorasValor');
    const totalMinutosSpan = document.getElementById('totalMinutosValor');
    if (totalHorasSpan && totalMinutosSpan) {
      totalHorasSpan.textContent = totalHoras.toString();
      totalMinutosSpan.textContent = totalMinutos.toString();
    }
  }

  //Docencia Directa

 // Método para buscar las secciones disponibles para un código de asignatura dado
 buscarSecciones() {
  const codigo = (document.getElementById('codigo') as HTMLInputElement).value;

  this.http.get<any>(`http://localhost:3000/obtener-secciones/${codigo}`)
    .subscribe(
      (data) => {
        const seccionSelect = document.getElementById('seccion') as HTMLSelectElement;
        seccionSelect.innerHTML = ''; // Limpiar opciones anteriores
        if (Array.isArray(data)) {
          data.forEach((seccion) => {
            const option = document.createElement('option');
            option.value = seccion.idSeccion;
            option.textContent = seccion.idSeccion;
            seccionSelect.appendChild(option);
          });
        } else {
          console.error('La respuesta del servidor no es un array:', data);
        }
        // Después de obtener las secciones, agregar filas a ambas tablas
        this.agregarFila();
        // this.agregarFilaIndirecta('Planificación', 1440); // Ejemplo de valores para concepto y minutos
      },
      (error) => {
        console.error('Error al obtener secciones:', error);
        alert('Ocurrió un error al obtener las secciones. Por favor, inténtalo de nuevo más tarde.');
      }
    );
}
}