import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { ProfesorService } from '../profesor.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-profe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-profe.component.html',
  styleUrl: './crear-profe.component.css'
})
export class CrearProfeComponent {
  
  
    form!: FormGroup;
        
    /*------------------------------------------
    --------------------------------------------
    Crear constructor
    --------------------------------------------
    --------------------------------------------*/
    constructor(
      public profesorService: ProfesorService,
      private router: Router
    ) { }
        
    /**
     * Write code on Method
     *
     * @return response()
     */
    ngOnInit(): void {
      this.form = new FormGroup({
        idProfesor: new FormControl('', [Validators.required]),
        Nombre: new FormControl('', [Validators.required]),
        Tipo: new FormControl('', Validators.required),
        Profesion: new FormControl('', [Validators.required]),
        Horas: new FormControl('', [Validators.required]),
        ValorHora: new FormControl('', [Validators.required]),
        idJerarquia: new FormControl('', [Validators.required]),
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
      this.profesorService.create(this.form.value).subscribe((res:any) => {
           console.log('profesor creado successfully!');
           this.router.navigateByUrl('profesor/index-profe');
      })
    }
    
  }

