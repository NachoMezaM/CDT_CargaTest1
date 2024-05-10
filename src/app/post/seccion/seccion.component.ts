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
      idAsignatura: new FormControl('', [Validators.required])
    });
  }






  get f(){
    return this.form.controls;
  }


  submit(){
    console.log(this.form.value);
    this.postService.create(this.form.value).subscribe((res:any) => {
         console.log('seccion creada con exito!');
         this.router.navigateByUrl('post/index');
    })
  }
}