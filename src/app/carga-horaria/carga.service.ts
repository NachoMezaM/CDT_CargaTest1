import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private cargarDatosProfesorSubject = new Subject<void>();

  cargarDatosProfesor$ = this.cargarDatosProfesorSubject.asObservable();

  triggerCargarDatosProfesor() {
    this.cargarDatosProfesorSubject.next();
  }
}