import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { asignaturaService } from '../asignatura.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
  
@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent {
  
  form!: FormGroup;
      
  /*------------------------------------------
  --------------------------------------------
  Crear constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public asignaturaService: asignaturaService,
    private router: Router
  ) { }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
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
    this.asignaturaService.create(this.form.value).subscribe((res:any) => {
         console.log('asignatura creada successfully!');
         this.router.navigateByUrl('asignatura/index');
    })
  }
  
}