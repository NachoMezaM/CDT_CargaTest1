import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-seccion',
  imports: [ReactiveFormsModule,CommonModule,RouterOutlet, RouterLink],
  standalone: true,
  templateUrl: './seccion.component.html',
  styleUrl: './seccion.component.css'
})
export class SeccionComponent {
  url = '';
  datos: any = {};
  showresultado = false;
  id!: number;
  post!: Post;
  form!: FormGroup;
  form2!: FormGroup;
  facultades = [
    { id: 'FI', nombre: 'Facultad de Ingenieria y Negocios', carreras: [
        { nombre: 'FAIN', valor: 'FI' },
        { nombre: 'Agronomia', valor: 'AG' },
        { nombre: 'Contador Auditor Online', valor: 'CO' },
        { nombre: 'Ingenieria Civil Industrial', valor: 'CI' },
        { nombre: 'Ingenieria Civil Informatica', valor: 'II' },
        { nombre: 'Ingenieria Comercial', valor: 'IC' }
    ] },
    { id: 'FS', nombre: 'Facultad de Salud', carreras: [
        { nombre: 'Facultad', valor: 'FS' },
        { nombre: 'Enfermería', valor: 'EN' },
        { nombre: 'Nutricion y Dietetica', valor: 'NU' },
        { nombre: 'Obstetricia y Puericultura', valor: 'OB' },
        { nombre: 'Quimica y Farmacia', valor: 'QF' },
        { nombre: 'Tecnico de Nivel Superior en Enfermeria', valor: 'ET' },
        { nombre: 'Terapia Ocupacional', valor: 'TO' }
    ] },
    { id: 'FE', nombre: 'Facultad de Educacion', carreras: [
        { nombre: 'Facultad', valor: 'FE' },
        { nombre: 'Educación Parvularia', valor: 'EP' },
        { nombre: 'Licenciatura en Educacion', valor: 'LE' },
        { nombre: 'Pedagogía en Educación Diferencial', valor: 'ED' },
        { nombre: 'Pedagogía en Educación Física', valor: 'EF' },
        { nombre: 'Pedagogía en Educación General Básica', valor: 'EB' },
        { nombre: 'Pedagogía en Inglés', valor: 'PI' },
        { nombre: 'Pedagogía en Música', valor: 'MU' },
    ] },
    { id: 'DE', nombre: 'Facultad de Ciencias Juridicas y Sociales', carreras: [
        { nombre: 'Facultad', valor: 'FD' },
        { nombre: 'Derecho', valor: 'DE' },
        { nombre: 'Psicología', valor: 'PS' },
        { nombre: 'Trabajo Social', valor: 'TS' },
        { nombre: 'Licenciatura en Trabajo Social', valor: 'LS' }
    ] },
    { id: 'TE', nombre: 'Facultad de Teologia', carreras: [
        { nombre: 'Teologia', valor: 'TE' }
    ] },
    { id: 'XX', nombre: 'Complementario', carreras: [
      { nombre: 'Complementario', valor: 'CO' }
  ] }
];

  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ){

  }

  onresultadochange(){
    this.showresultado = true;
  }
  
  
  setresultado(event: Event) {
   const target=event.target as HTMLSelectElement;
   const selectvalue=target.value;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.find(this.id).subscribe((data: Post)=>{
      this.post = data;
    }); 
    this.form = new FormGroup({
      idAsignatura: new FormControl('', [Validators.required]),
      Facultad: new FormControl('', [Validators.required]),
      Carrera: new FormControl('', [Validators.required]),
      Semestre: new FormControl('', [Validators.required]),
      grupos: new FormControl('',[Validators.required])
    });
  }

  get Carreras() {
    const facultadControl = this.form.get('Facultad');
    if (facultadControl && facultadControl.touched) {
      const facultadId = facultadControl.value;
      const facultad = this.facultades.find(f => f.id === facultadId);
      return facultad? facultad.carreras : [];
    }
    return [];
  }



  mostrar() {
    const carreraControl = this.form.get('Carrera')!;
    const carrera = this.Carreras.find(c => c.nombre === carreraControl.value);
    const carreraValor = carrera? carrera.valor : null;
    const idAsignatura = this.form.value.idAsignatura;
    const Semestre = this.form.value.Semestre;
    const grupos = this.form.value.grupos;
    if (carreraValor) {
      this.form.patchValue({ Carrera: carreraValor });
    }
    this.url = `${idAsignatura}/${carreraValor}${Semestre}${grupos}`;
    console.log("Funca hasta aca")
    
    this.datos = {
      url: this.url,
      idAsignatura: this.form.value.idAsignatura,
      Semestre: this.form.value.Semestre,
      carreraValor: carrera?.valor
    };
       console.log(this.datos)
   
  }
    submit(){
      this.postService.crear(this.datos).subscribe((res:any) => {
        console.log("ola")
        console.log('Seccion created successfully!');
        this.router.navigateByUrl('post/index');
   })  
    }
  }
