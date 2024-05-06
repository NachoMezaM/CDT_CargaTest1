import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-seccion',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './seccion.component.html',
  styleUrl: './seccion.component.css'
})
export class SeccionComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){}
}

