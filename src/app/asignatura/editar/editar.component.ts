import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { asignaturaService } from '../asignatura.service';
import { ActivatedRoute, Router } from '@angular/router';
import { asignatura } from '../asignatura';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
  
@Component({
    selector: 'app-edit',
    standalone: true,
    templateUrl: './editar.component.html',
    styleUrl: './editar.component.css',
    imports: [CommonModule, ReactiveFormsModule, BarranavegacionComponent]
})
export class EditarComponent {
  
  id!: number;
  asignatura!: asignatura;
  form!: FormGroup;
      
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
        
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', Validators.required)
    });
  }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  get f(){
    return this.form.controls;
  }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  submit(){
    console.log(this.form.value);
    this.asignaturaService.update(this.id, this.form.value).subscribe((res:any) => {
         console.log('asignatura updated successfully!');
         this.router.navigateByUrl('asignatura/index');
    })
  }
  
}