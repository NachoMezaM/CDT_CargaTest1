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

  id!: number;
  post!: Post;
  form!: FormGroup;
  facultades = [
    { id: 'FI', nombre: 'Facultad de Ingenieria y Negocios', carreras: ['Ingeniería en Sistemas', 'Ingeniería en Electrónica'] },
    { id: 'FS', nombre: 'Facultad de Salud', carreras: ['Medicina', 'Enfermería'] },
    { id: 'FE', nombre: 'Facultad de Educacion', carreras: ['Educación Primaria', 'Educación Secundaria'] },
    { id: 'TE', nombre: 'Facultad de Teologia', carreras: ['Teología', 'Filosofía'] },
    { id: 'DE', nombre: 'Facultad de Ciencias Juridicas y Sociales', carreras: ['Derecho', 'Ciencias Políticas'] },
  ];

  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.find(this.id).subscribe((data: Post)=>{
      this.post = data;
    }); 
    this.form = new FormGroup({
      idAsignatura: new FormControl('', [Validators.required]),
      Facultad: new FormControl('', [Validators.required]),
      Carrera: new FormControl('', [Validators.required]),
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
  }}