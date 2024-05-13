import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, RouterLink } from '@angular/router';
import { VisualizarCargaService } from '../visualizar-carga.service';
import { VisualizarCA } from '../visualizar-carga'
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
import { CargaHorariaComponent } from "../carga-horaria/carga-horaria.component";

@Component({
    selector: 'app-carga-horaria2',
    standalone: true,
    templateUrl: './carga-horaria2.component.html',
    styleUrl: './carga-horaria2.component.css',
    imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent, CargaHorariaComponent]
})
export class CargaHoraria2Component {
  visualizarCA: VisualizarCA[] = [];
  filteredPosts: any[] = [];
  busqueda: string = '';


  /*
  Busqueda por estado || Activo = "Activo" / Inactivo = "Inactivo"
  filterByEstado(estado: string) {
   this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.Estado === estado);
  }*/
  //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
  onSearch(event: any) {
    this.busqueda = event.target.value;
    this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.idAsignaturaSeccion.toLocaleLowerCase().includes(this.busqueda) || visualizarCA.idProfesor.toLocaleLowerCase().includes(this.busqueda)
      || visualizarCA.idProfesor.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.includes(this.busqueda) || visualizarCA.idProfesor.includes(this.busqueda));
  }

  constructor(public visualizarService: VisualizarCargaService, private router: Router,) {
    this.filteredPosts = this.visualizarCA;
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
     this.visualizarService.buscarDatos('$event');
    }
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {

    this.visualizarService.getAll().subscribe((data: VisualizarCA[]) => {
      this.visualizarCA = data;
      this.filteredPosts = this.visualizarCA;
     
    })
  }


  /**
   * Write code on Method
   *
   * @return response()
   */
  deleteCargaH(idCargaDocente: number) {
    this.visualizarService.delete(idCargaDocente).subscribe(res => {
      this.visualizarCA = this.visualizarCA.filter(item => item.idCargaDocente !== idCargaDocente);
      console.log('Carga Horaria deleted successfully!');
    })
    window.location.reload();
  }


}