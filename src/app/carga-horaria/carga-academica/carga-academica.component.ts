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
  filteredPosts: any[] = [];
  busqueda: string = '';
  carrerasByFacultad: { [key: string]: { value: string; label: string; }[] } = {};
  planesByFacultad: { [key: string]: { value: string; label: number; }[] } = {};
  selectedFacultad: string = '';
  selectedCarrera: string = '';
  selectedPlan: string = '';
  selectedSemestre: string = '';

  constructor(private fb: FormBuilder, public visualizarService: VisualizarCargaService) {
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
    });
    this.form.get('Facultad')?.valueChanges.subscribe(value => {
      this.selectedFacultad = value;
      this.showCarrera = false;
      this.showPlan = false;
      this.showSemestre = false;
      this.filtro(this.selectedFacultad, this.selectedCarrera, this.selectedPlan, this.selectedSemestre);
    });

    this.form.get('Carrera')?.valueChanges.subscribe(value => {
      this.selectedCarrera = value;
      this.showPlan = false;
      this.showSemestre = false;
      this.filtro(this.selectedFacultad, this.selectedCarrera, this.selectedPlan, this.selectedSemestre);
    });

    this.form.get('Plan')?.valueChanges.subscribe(value => {
      this.selectedPlan = value;
      this.showSemestre = false;
      this.filtro(this.selectedFacultad, this.selectedCarrera, this.selectedPlan, this.selectedSemestre);
    });

    this.form.get('Semestre')?.valueChanges.subscribe(value => {
      this.selectedSemestre = value;
      this.filtro(this.selectedFacultad, this.selectedCarrera, this.selectedPlan, this.selectedSemestre);
    });

  }

  filtro(facultad: string, carrera: string, plan: string, semestre: string) {
    facultad = facultad || '0';
    carrera = carrera || '0';
    plan = plan || '0';
    semestre = semestre || '0';
    let link = [facultad,carrera,plan,semestre];
    // Aquí puedes implementar la lógica de filtrado basada en los valores seleccionados
    console.log('Filtro aplicado con los valores:', link);

    this.ConsultaFiltro(link)

  }

  ConsultaFiltro(link: any) {
    this.visualizarService.filtrotabla(link).subscribe((data: VisualizarCA[]) => {
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
      this.form.get('Carrera')?.setValue('');
      console.log(this.carrerasByFacultad);
    });
  }

  onCarreraChange(event: Event, fieldName: string) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = Number(target.value);
    // Keep as string for indexing
    console.log(selectedValue);
    this.setPlan(selectedValue, fieldName)

    this.showPlan = true;
  }
  onPlanChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = Number(target.value);
    console.log(selectedValue);
    this.showSemestre = true;
  }
  onSemestreChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = Number(target.value);
    console.log(selectedValue);
    this.showSemestre = true;
  }
  setPlan(year: number, fieldName: string) {
    this.visualizarService.plan(year).subscribe((data: CargaAcademica[]) => {
      const planes = data.map(CargaAcademica => ({
        value: `${CargaAcademica.AnioPlan}`,
        label: CargaAcademica.AnioPlan
      }));
      this.planesByFacultad[fieldName] = planes;
      this.planes = this.planesByFacultad[fieldName] || [];
      this.form.get('Plan')?.setValue('');
    });
  }

  //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
  onSearch(event: any) {
    this.busqueda = event.target.value;
    this.filteredPosts = this.visualizarCA.filter(visualizarCA => visualizarCA.idAsignaturaSeccion.toLocaleLowerCase().includes(this.busqueda) || visualizarCA.idProfesor.toLocaleLowerCase().includes(this.busqueda)
      || visualizarCA.idProfesor.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.toLocaleUpperCase().includes(this.busqueda) || visualizarCA.idAsignaturaSeccion.includes(this.busqueda) || visualizarCA.idProfesor.includes(this.busqueda));
  }
}
