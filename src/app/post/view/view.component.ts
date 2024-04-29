import { Component } from '@angular/core';
  
import { PostService } from '../post.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Post } from '../post';
import { BarranavegacionComponent } from "../../barranavegacion/barranavegacion.component";
  
@Component({
    selector: 'app-view',
    standalone: true,
    templateUrl: './view.component.html',
    styleUrl: './view.component.css',
    imports: [BarranavegacionComponent, RouterOutlet, RouterLink]
})
export class ViewComponent {
  
  id!: number;
  post!: Post;
      
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
  }
  
}