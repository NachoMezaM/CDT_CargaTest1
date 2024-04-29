import { Component } from '@angular/core';
  
import { asignaturaService } from '../asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import { asignatura } from '../asignatura';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
  
@Component({
    selector: 'app-view',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.css',
    imports: [BarranavegacionComponent]
})
export class ViewComponent {
  
  id!: number;
  asignatura!: asignatura;
      
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public asignaturaService: asignaturaService,
    private route: ActivatedRoute,
    private router: Router
   ) { }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.params['asignaturaId'];
          
    this.asignaturaService.find(this.id).subscribe((data: asignatura)=>{
      this.asignatura = data;
    });
  }
  
}