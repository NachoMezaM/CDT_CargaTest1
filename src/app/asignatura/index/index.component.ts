import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { asignaturaService } from '../asignatura.service';
import { asignatura } from '../asignatura';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  asignatura: asignatura[] = [];
    
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(public asignaturaService: asignaturaService, private router: Router) { }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.asignaturaService.getAll().subscribe((data: asignatura[])=>{
      this.asignatura = data;
     
    })  
  }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  deleteasignatura(id:number){
    this.asignaturaService.delete(id).subscribe(res => {
         this.asignatura = this.asignatura.filter(item => item.id !== id);
         console.log('asignatura deleted successfully!');
    })
  }
}
