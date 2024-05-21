
import { Component } from '@angular/core';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-carga-academica',
    standalone: true,
    templateUrl: './carga-academica.component.html',
    styleUrl: './carga-academica.component.css',
    imports: [BarranavegacionComponent,ReactiveFormsModule,FormsModule,CommonModule]
})
export class CargaAcademicaComponent {
    form: FormGroup;
  showCarrera = false;
  carreras: { value: string; label: string; }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      Facultad: [''],
      Carrera: ['']
    });
  }

  onFacultadChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value; // Keep as string for indexing
    console.log('Selected value:', selectedValue);

    // Lógica para mostrar el campo "carrera" y definir sus opciones
    this.showCarrera = true;
    this.setCarreras(selectedValue);
  }

  setCarreras(facultadId: string) {
    // Define las opciones de carrera según la facultad seleccionada
    const carrerasByFacultad: { [key: string]: { value: string; label: string; }[] } = {
      '1': [
        { value: '1-1', label: 'Enfermería ' },
        { value: '1-2', label: 'Nutrición y Dietética' },
        { value: '1-3', label: 'Obstetricia y Puericultura' },
        { value: '1-4', label: 'Química y Farmacia' },
        { value: '1-5', label: 'Técnico de Nivel Superior en Enfermería' },
        { value: '1-6', label: 'Terapia Ocupacional' },

        
      ],
      '2': [
        { value: '2-1', label: 'Ingeniería en Agronomía' },
        { value: '2-2', label: 'Contador Auditor' },
        { value: '2-3', label: 'Ingeniería Civil Industrial' },
        { value: '2-4', label: 'Ingeniería Civil Informática' },
        { value: '2-5', label: 'Ingeniería Comercial' },
      ],
      '3': [
        { value: '3-1', label: 'Educación Parvularia' },
        { value: '3-2', label: 'Licenciatura en Educación ' },
        { value: '3-3', label: 'Pedagogía en Educación Diferencial ' },
        { value: '3-4', label: 'Pedagogía en Educación Física' },
        { value: '3-5', label: 'Educación General Básica ' },
        { value: '3-6', label: 'Pedagogía en Inglés' },
        { value: '3-7', label: 'Pedagogía en Música' },
      ],
      '4': [
        { value: '4-1', label: 'Teología' },
       
      ],
      '5': [
        { value: '5-1', label: 'Derecho' },
        { value: '5-2', label: 'Psicología' },
        { value: '5-2', label: 'Trabajo Social' },
        { value: '5-2', label: 'Licenciatura en Trabajo Social' },
      ],
    };

    this.carreras = carrerasByFacultad[facultadId] || [];
    this.form.get('Carrera')?.setValue(this.carreras.length ? this.carreras[0].value : '');
  }
    }
