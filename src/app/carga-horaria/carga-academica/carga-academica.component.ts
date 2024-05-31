import { Component } from '@angular/core';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { VisualizarCA} from '../visualizar-carga';
import { VisualizarCargaService } from '../visualizar-carga.service';

@Component({
  selector: 'app-carga-academica',
  standalone: true,
  templateUrl: './carga-academica.component.html',
  styleUrls: ['./carga-academica.component.css'],
  imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent,ReactiveFormsModule, FormsModule]
})
export class CargaAcademicaComponent {
  form: FormGroup;
  showCarrera = false;
  showSemestre = false;
  showSeccion = false;
  showPlan=false;
  showAsignatura=false;
  showHoras=false;
  carreras: { value: string; label: string; }[] = [];
  visualizarCA: VisualizarCA[] = [];
  filteredPosts: any[] = [];  
  busqueda: string = '';

  constructor(private fb: FormBuilder, public visualizarService: VisualizarCargaService) {
    this.form = this.fb.group({
      Facultad: [''],
      Carrera: [''],
      Semestre: [''],
      Seccion:[''],
      Plan:[''],
    });
    this.filteredPosts=this.visualizarCA;
    
  }
  ngOnInit(): void {
 
    this.visualizarService.getAll().subscribe((data: VisualizarCA[])=>{
      this.visualizarCA = data;
      this.filteredPosts = this.visualizarCA;
      console.log(this.visualizarCA);
    })  
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
        { value: '5-3', label: 'Trabajo Social' },
        { value: '5-4', label: 'Licenciatura en Trabajo Social' },
      ],
    };

    this.carreras = carrerasByFacultad[facultadId] || [];
    this.form.get('Carrera')?.setValue(this.carreras.length ? this.carreras[0].value : '');
  }
  onSelectionChange(event: Event, fieldName: string) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value; // Keep as string for indexing
    console.log(`${fieldName} seleccionada:`, selectedValue);

    // Update the appropriate show field based on the fieldName
    switch (fieldName) {
        case 'carrera':
            this.showPlan = !!selectedValue;
            break;
        case 'plan':
            this.showSemestre = !!selectedValue;
            break;
        case 'semestre':
            // Handle semester-specific logic if any
            break;
        case 'seccion':
            this.showSeccion = !!selectedValue;
            break;
        case 'asignatura':
            this.showAsignatura = !!selectedValue;
            break;
        case 'horas':
            this.showHoras = !!selectedValue;
            break;
        default:
            break;
    }
}

setSelection(event: Event, fieldName: string) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value; // Keep as string for indexing
    console.log(`${fieldName} seleccionado:`, selectedValue);
}




/*
Busqueda por estado || Activo = "Activo" / Inactivo = "Inactivo"
filterByEstado(estado: string) {
this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.Estado === estado);
}*/
//Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
onSearch(event: any) {
this.busqueda = event.target.value;
this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.idAsignaturaSeccion.toLocaleLowerCase().includes(this.busqueda) || visualizarCA.idProfesor.toLocaleLowerCase().includes(this.busqueda)
|| visualizarCA.idProfesor.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.includes(this.busqueda) || visualizarCA.idProfesor.includes(this.busqueda));
}




}
