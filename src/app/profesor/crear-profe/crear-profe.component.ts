import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { ProfesorService } from '../profesor.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";

@Component({
    selector: 'app-crear-profe',
    standalone: true,
    templateUrl: './crear-profe.component.html',
    styleUrl: './crear-profe.component.css',
    imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, BarranavegacionComponent]
})
export class CrearProfeComponent {
  
  
    form!: FormGroup;
    mensajeRespuesta: string = '';
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
        Direccion: new FormControl('', [Validators.required]),
        Telefono: new FormControl('', [Validators.required]),
        Grado: new FormControl('', [Validators.required]),
        TituloGrado: new FormControl('', [Validators.required]),
        Estado: new FormControl('', [Validators.required]),
        Apellido: new FormControl('', [Validators.required]),

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
    submit() {
      console.log(this.form.value);
      this.profesorService.create(this.form.value).subscribe(
        (res: any) => {
          console.log('Profesor creado exitosamente!');
          this.mensajeRespuesta = 'Profesor creado exitosamente';
          setTimeout(() => {
            this.router.navigateByUrl('profesor/index-profe');
          }, 2000); // Redirige después de 2 segundos
        },
        error => {
      console.error('Error al crear profesor:', error);
      if (error && error.error === 'Ya existe un profesor con ese ID') {
        this.mensajeRespuesta = 'Ya existe un profesor con ese ID. Por favor, elige otro ID.';
      } else if (error && error.error && typeof error.error === 'string') {
        this.mensajeRespuesta = 'Error al crear profesor: ' + error.error;
      } else {
        this.mensajeRespuesta = 'Error al crear profesor. Por favor, verifique que estan correctos los datos.';
      }
    }
  );
    }
    
  }

