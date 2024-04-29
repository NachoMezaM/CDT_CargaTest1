import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../post';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  posts: Post[] = [];
  filteredPosts: any[] = [];  
  busqueda: string = '';

  //Busqueda por estado || Activo = "Activo" / Inactivo = "Inactivo"
  filterByEstado(estado: string) {
    this.filteredPosts = this.posts.filter(post => post.Estado === estado);
}
 //Busqueda por letras, Busca por (Todo Mayuscula, Todo Minuscula, Mayusculas y Minusculas)
onSearch(event: any) {
  this.busqueda = event.target.value;

  this.filteredPosts = this.posts.filter(post => post.Nombre.toLocaleLowerCase().includes(this.busqueda) || post.idAsignatura.toLocaleLowerCase().includes(this.busqueda)
  || post.idAsignatura.toLocaleUpperCase().includes(this.busqueda) || post.Nombre.toLocaleUpperCase().includes(this.busqueda) || post.Nombre.includes(this.busqueda) || post.idAsignatura.includes(this.busqueda));
}

  constructor(public postService: PostService, private router: Router) { 
    this.filteredPosts = this.posts;
  }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    console.log(this.router.url);
    console.log( window.location.href);
    this.postService.getAll().subscribe((data: Post[])=>{
      this.posts = data;
      console.log(this.posts);
    })  
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  
}