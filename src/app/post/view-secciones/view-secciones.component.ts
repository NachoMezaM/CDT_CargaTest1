import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Seccion } from '../seccion';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
@Component({
  selector: 'app-view-secciones',
  standalone: true,
  imports: [CommonModule, RouterModule, BarranavegacionComponent],
  templateUrl: './view-secciones.component.html',
  styleUrl: './view-secciones.component.css'
})
export class ViewSeccionesComponent {
  seccion: Seccion[] = [];
  filteredSeccion: any[] = [];  
  busqueda: string = '';

  // inicio sin filtro
 


 //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
onSearch(event: any) {
  this.busqueda = event.target.value;

  this.filteredSeccion = this.seccion.filter(Seccion => Seccion.idAsignatura.toLocaleLowerCase().includes(this.busqueda) || Seccion.idAsignatura.toLocaleUpperCase().includes(this.busqueda) || Seccion.idAsignatura.includes(this.busqueda));
}

  constructor(public postService: PostService, private router: Router) { 
    
  }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
   
    this.postService.getAllSeccion().subscribe((data: Seccion[])=>{
      this.seccion = data;
      this.filteredSeccion = this.seccion;
      console.log(this.seccion);
    })  
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  
}