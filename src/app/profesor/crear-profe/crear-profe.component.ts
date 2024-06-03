import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { ProfesorService } from '../profesor.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";

@Component({
    selector: 'app-crear-profe',
    standalone: true,
    templateUrl: './crear-profe.component.html',
    styleUrl: './crear-profe.component.css',
    imports: [CommonModule, ReactiveFormsModule, RouterOutlet, RouterLink, BarranavegacionComponent]
})
export class CrearProfeComponent {

  submitDisabled: boolean = true;
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
        


    verificarRut(): void {
      const rut = this.form.value.idProfesor;
  
      if (!rut) {
          alert('Debes ingresar un Rut.');
          return;
      }
  
      const partesRut = rut.split('-');
      const numeroRut = partesRut[0];
      const digitoVerificador = partesRut[1];
  
      if (!numeroRut ||!digitoVerificador) {
          alert('El formato de Rut es incorrecto. Debe ser xxxxxxxx-x');
          return;
      }
  
      const valid = this.validateRutChileno(rut);
  
      if (valid) {
        this.submitDisabled = false;
          alert('El Rut es válido.');
      } else {
        this.submitDisabled = true;
          alert('El Rut es inválido.');
      }
  }
  
  validateRutChileno(rut: string): boolean {
      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
          return false;
      }
  
      const rutSinGuion = rut.replace(/-/g, '');
      const rutSinDigitoVerificador = rutSinGuion.substring(0, rutSinGuion.length - 1);
      const digitoVerificador = rutSinGuion.substring(rutSinGuion.length - 1);
  
      let suma = 0;
      let multiplicador = 2;
  
      for (let i = rutSinDigitoVerificador.length - 1; i >= 0; i--) {
          const digito = parseInt(rutSinDigitoVerificador[i]);
          suma += digito * multiplicador;
          multiplicador = multiplicador === 7? 2 : multiplicador + 1;
      }
  
      const resto = suma % 11;
      const digitoVerificadorCalculado = resto === 0? '0' : resto === 1? 'k' : String(11 - resto);
  
      return digitoVerificadorCalculado === digitoVerificador.toLowerCase();
  }
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

