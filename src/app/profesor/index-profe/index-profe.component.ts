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
    
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(public profesorService: ProfesorService, private router: Router) { }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.profesorService.getAll().subscribe((data: Profesor[])=>{
      this.profesor = data;
     
    })  
  }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  deleteprofesor(idProfesor:number){
    this.profesorService.delete(idProfesor).subscribe(res => {
         this.profesor = this.profesor.filter(item => item.idProfesor !== idProfesor);
         console.log('profesor deleted successfully!');
    })
  }
}
