import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { PostService } from '../post.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Post } from '../post';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
  
@Component({
    selector: 'app-edit',
    standalone: true,
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css',
    imports: [CommonModule, ReactiveFormsModule, BarranavegacionComponent, RouterOutlet, RouterLink]
})
export class EditComponent {
  
  id!: number;
  post!: Post;
  form!: FormGroup;
      
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];
    this.postService.find(this.id).subscribe((data: Post)=>{
      this.post = data;
    }); 
  
        
    this.form = new FormGroup({
      idAsignatura: new FormControl('', [Validators.required]),
      Nombre: new FormControl('', [Validators.required]),
      TipoAsignatura: new FormControl('', Validators.required),
      NumeroAlumnos: new FormControl('', Validators.required),
      Horas: new FormControl('', [Validators.required]),
      Estado: new FormControl('', [Validators.required])
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
  submit(){
    console.log(this.form.value);
    this.postService.update(this.id, this.form.value).subscribe((res:any) => {
         console.log('Post updated successfully!');
         this.router.navigateByUrl('post/index');
    })
  }
  
}