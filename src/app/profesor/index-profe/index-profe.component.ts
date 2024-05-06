import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterOutlet, RouterLink } from '@angular/router';
import { ProfesorService } from '../profesor.service';
import { Profesor } from '../profesor';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
@Component({
    selector: 'app-index-profe',
    standalone: true,
    templateUrl: './index-profe.component.html',
    styleUrl: './index-profe.component.css',
    imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent]
})
export class IndexProfeComponent {
  profesor: Profesor[] = [];
  filteredProfesor: any[] = [];  
  busqueda: string = '';

 //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
onSearch(event: any) {
  this.busqueda = event.target.value;
  this.filteredProfesor = this.profesor.filter(profesor => profesor.Nombre.toLocaleLowerCase().includes(this.busqueda) 
  ||  profesor.Nombre.toLocaleUpperCase().includes(this.busqueda) || profesor.Nombre.includes(this.busqueda) || profesor.idProfesor.includes(this.busqueda) )
}

  constructor(public profesorService: ProfesorService, private router: Router) {
    this.filteredProfesor = this.profesor;
   }
  
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.profesorService.getAll().subscribe((data: Profesor[])=>{
      this.profesor = data;
      this.filteredProfesor=this.profesor
     
    })  
  }
   obtenerJerarquia(Jerarquia: number): string {
    switch (Jerarquia) {
        case 1:
            return 'Instructor';
        case 2:
            return 'Asistente';
        case 3:
            return 'Asociado';
        case 4:
            return 'Titular';
        default:
            return 'Opción no válida';
    }
}

obtenerTipo(Tipo: string): string {
  switch (Tipo) {
      case "C" :
          return 'Contrato';
      case "H":
          return 'Honorario';
      default:
          return 'Opción no válida';
  }
}


    
  /**
   * Write code on Method
   *
   * @return response()
   */
}
