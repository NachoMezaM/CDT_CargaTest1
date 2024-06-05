import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfesorService } from '../profesor.service';
import { RouterModule, Router, ActivatedRoute, RouterOutlet, RouterLink,  } from '@angular/router';
import { Profesor } from '../profesor';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
@Component({
    selector: 'app-view-profe',
    standalone: true,
    templateUrl: './view-profe.component.html',
    styleUrl: './view-profe.component.css',
    imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent]
})
export class ViewProfeComponent {
  idProfesor!: number;
  profesor!: Profesor;

      
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router
   ) { }

 

  ngOnInit(): void {
    this.idProfesor = this.route.snapshot.params['profesoridProfesor'];
   
      this.profesorService.find(this.idProfesor).subscribe((data: Profesor) => {
          this.profesor = data;
      });
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
  obtenerEstado(Estado: string): string {
    switch (Estado) {
        case "A" :
            return 'Activo';
        case "I":
            return 'Inactivo';
        default:
            return 'Opción no válida';
    }
  }
}
