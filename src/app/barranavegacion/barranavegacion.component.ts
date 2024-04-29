import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-barranavegacion',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink],
  templateUrl: './barranavegacion.component.html',
  styleUrl: './barranavegacion.component.css'
})
export class BarranavegacionComponent {

}
