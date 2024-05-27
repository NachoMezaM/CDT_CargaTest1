import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { PostService } from '../post.service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
  
@Component({
    selector: 'app-create',
    standalone: true,
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    imports: [CommonModule, ReactiveFormsModule, BarranavegacionComponent,RouterLink]
})
export class CreateComponent {
  
  form!: FormGroup;
      

  constructor(
    public postService: PostService,
    private router: Router
  ) { }
      
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
    this.form = new FormGroup({
      idAsignatura: new FormControl('', [Validators.required]),
      Nombre: new FormControl('', [Validators.required]),
      TipoAsignatura: new FormControl('', Validators.required),
      NumeroAlumnos: new FormControl('', Validators.required),
      Horas: new FormControl('', [Validators.required]),
      idPlanAcademico: new FormControl('',[Validators.required])
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
    this.postService.create(this.form.value).subscribe((res:any) => {
         console.log('Post created successfully!');
         this.router.navigateByUrl('post/index');
    })
  }
  
}