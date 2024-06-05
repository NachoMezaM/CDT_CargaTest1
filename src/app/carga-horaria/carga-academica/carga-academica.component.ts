import { Component } from '@angular/core';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { VisualizarCA } from '../visualizar-carga';
import { VisualizarCargaService } from '../visualizar-carga.service';
import { CargaAcademica } from '../CargaAcademica';

@Component({
  selector: 'app-carga-academica',
  standalone: true,
  templateUrl: './carga-academica.component.html',
  styleUrls: ['./carga-academica.component.css'],
  imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, BarranavegacionComponent, ReactiveFormsModule, FormsModule]
})
export class CargaAcademicaComponent {
  form: FormGroup;
  showCarrera = false;
  showSemestre = false;
  showSeccion = false;
  showPlan = false;
  carreras: { value: string; label: string; }[] = [];
  planes: { value: string; label: number; }[] = [];
  visualizarCA: VisualizarCA[] = [];
  cargaAcademica: CargaAcademica[] = [];
  filteredPosts: any[] = [];
  busqueda: string = '';
  carrerasByFacultad: { [key: string]: { value: string; label: string; }[] } = {};
  planesByFacultad: { [key: string]: { value: string; label: number; }[] } = {};


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      Facultad: [''],
      Carrera: [''],
      Semestre: [''],
      Plan: [''],
    });
    this.filteredPosts = this.visualizarCA;
  }
  ngOnInit(): void {

    this.visualizarService.getAll().subscribe((data: VisualizarCA[]) => {
      this.visualizarCA = data;
      this.filteredPosts = this.visualizarCA;
      console.log(this.visualizarCA);
    })
  }

  onFacultadChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = Number(target.value);
    console.log('Selected value:', selectedValue);
    // Lógica para mostrar el campo "carrera" y definir sus opciones
    this.showCarrera = true;
    this.setCarreras(selectedValue);
  }

  setCarreras(facultadId: number) {
    this.visualizarService.facultad(facultadId).subscribe((data: CargaAcademica[]) => {
      const carreras = data.map(cargaAcademica => ({
        value: `${cargaAcademica.idCarrera}`,
        label: cargaAcademica.Nombre
      }));

      this.carrerasByFacultad[facultadId] = carreras;
      this.carreras = this.carrerasByFacultad[facultadId] || [];
      if (this.carreras.length > 0) {
        this.form.get('Carrera')?.setValue(this.carreras[0].value);
      }
      console.log(this.carrerasByFacultad);
    });
  }

  onSelectionChange(event: Event, fieldName: string) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = Number(target.value);
    // Keep as string for indexing
    console.log(selectedValue);
    this.setPlan(selectedValue, fieldName)

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
      default:
        break;
    }
  }
  setPlan(year: number, fieldName: string) {

    this.visualizarService.plan(year).subscribe((data: CargaAcademica[]) => {
      const planes = data.map(CargaAcademica => ({
        value: `${CargaAcademica.AnioPlan}`,
        label: CargaAcademica.AnioPlan
      }));
      this.planesByFacultad[fieldName] = planes;
      this.planes = this.planesByFacultad[fieldName] || [];
      
        this.form.get('Plan')?.setValue(this.carreras.length ? this.carreras[0].value : '');
      
      console.log(this.planesByFacultad);
    });
  }

  //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
  onSearch(event: any) {
    this.busqueda = event.target.value;
    this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.idAsignaturaSeccion.toLocaleLowerCase().includes(this.busqueda) || visualizarCA.idProfesor.toLocaleLowerCase().includes(this.busqueda)
      || visualizarCA.idProfesor.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.includes(this.busqueda) || visualizarCA.idProfesor.includes(this.busqueda));
  }
}
