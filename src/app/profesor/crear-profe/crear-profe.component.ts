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
  datos: any = {};
  rutdb!: string;
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
        


    verificarRut(event: any) {
      const rut = event.target.value;
  
      if (!rut) {
          return;
      }
  
      const partesRut = rut.split('-');
      const numeroRut = partesRut[0];
      const digitoVerificador = partesRut[1];
  
      if (!numeroRut ||!digitoVerificador) {
        this.form.get('idProfesor')!.setErrors({ required: true, rutInvalido: true });
          return;
      }
  
      const valid = this.validateRutChileno(rut);
  
      if (valid) {
        this.submitDisabled = false;
        this.form.get('idProfesor')!.setErrors(null);
      } else {
        this.submitDisabled = true;
        this.form.get('idProfesor')!.setErrors({ rutInvalido: true });
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
        idProfesor: new FormControl('', [Validators.required,]),
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

    guardar(){
      const rutsg = this.form.value.idProfesor.replace(/\D/g, '');
      const Nombre = this.form.value.Nombre;
      const Tipo = this.form.value.Tipo;
      const Profesion = this.form.value.Profesion;
      const Horas = this.form.value.Horas;
      const ValorHora = this.form.value.ValorHora; 
      const idJerarquia = this.form.value.idJerarquia; 
      const Direccion = this.form.value.Direccion; 
      const Telefono = this.form.value.Telefono; 
      const Grado = this.form.value.Grado; 
      const TituloGrado = this.form.value.TituloGrado; 
      const Estado = this.form.value.Estado; 
      const Apellido = this.form.value.Apellido;   
      this.rutdb = `${rutsg}`
      this.datos = {
       rutdb: this.rutdb,
       Nombre: this.form.value.Nombre,
       Tipo: this.form.value.Tipo,
       Profesion: this.form.value.Profesion,
       Horas: this.form.value.Horas,
       ValorHora: this.form.value.ValorHora, 
       idJerarquia: this.form.value.idJerarquia, 
       Direccion: this.form.value.Direccion, 
       Telefono: this.form.value.Telefono, 
       Grado: this.form.value.Grado, 
       TituloGrado: this.form.value.TituloGrado, 
       Estado: this.form.value.Estado, 
       Apellido: this.form.value.Apellido
      };  
    }


    submit() {
      this.guardar();
      console.log(this.datos);
      this.profesorService.create(this.datos).subscribe(
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

