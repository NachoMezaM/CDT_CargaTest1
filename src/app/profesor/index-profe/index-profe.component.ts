import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProfesorService } from '../profesor.service';
import { Profesor } from '../profesor';
@Component({
  selector: 'app-index-profe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index-profe.component.html',
  styleUrl: './index-profe.component.css'
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
