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
        Horas: new FormControl('', [Validators.required, this.maxNumberValidator]),
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
        
  );
    }
    maxNumberValidator(control: FormControl): { [key: string]: boolean } | null {
      const value = control.value;
      if (value > 42 ) {
        return { 'maxNumber': true };
      }else if(value==0){
        return{'minNumber':true };
      }
      return null;
    }
    
  }

