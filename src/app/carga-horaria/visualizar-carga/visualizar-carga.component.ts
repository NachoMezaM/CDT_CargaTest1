import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, RouterLink } from '@angular/router';
import { VisualizarCargaService } from '../visualizar-carga.service';
import { VisualizarCA} from '../visualizar-carga'
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
@Component({
    selector: 'app-visualizar-carga',
    standalone: true,
    templateUrl: './visualizar-carga.component.html',
    styleUrl: './visualizar-carga.component.css',
    imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent]
})
export class VisualizarCargaComponent {
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
  
    constructor(public visualizarService: VisualizarCargaService, private router: Router) { 
      this.filteredPosts=this.visualizarCA;
    }
      
    /**
     * Write code on Method
     *
     * @return response()
     */
    ngOnInit(): void {
     
      this.visualizarService.getAll().subscribe((data: VisualizarCA[])=>{
        this.visualizarCA = data;
        this.filteredPosts = this.visualizarCA;
        console.log(this.visualizarCA);
      })  
    }
  
    /**
     * Write code on Method
     *
     * @return response()
     */
    
  }