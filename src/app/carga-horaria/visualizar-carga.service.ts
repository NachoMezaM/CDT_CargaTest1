import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VisualizarCA } from './visualizar-carga';
import { Profesor } from '../profesor/profesor';
import { CargaAcademica } from './CargaAcademica';
import { CargaAcademica1 } from './CargaAcademicaA';

@Injectable({
  providedIn: 'root'
})
export class VisualizarCargaService {
  private apiURL = "http://localhost:3000";   //donde sirve el endpoint donde esta conectado
  /*------------------------------------------
  --------------------------------------------
  Http Header Options
  --------------------------------------------
  --------------------------------------------*/
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(private httpClient: HttpClient) { }
 
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/VisualizarCA/')
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  
  create(cargaDocente:VisualizarCA): Observable<any> {
    return this.httpClient.post(this.apiURL + '/VisualizarCA/crear-profe', JSON.stringify(cargaDocente), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  
  find(idCargaDocente:number): Observable<any> {
    console.log(this.httpClient.get(this.apiURL + '/VisualizarCA/' + idCargaDocente))
    return this.httpClient.get(this.apiURL + '/VisualizarCA/' + idCargaDocente)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  delete(idCargaDocente:number){
    return this.httpClient.delete(this.apiURL + '/VisualizarCA/' + idCargaDocente, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }      
 
  buscarDatos(idProfesor:string){
    return this.httpClient.get(this.apiURL+'/buscar-datos'+idProfesor)
    .pipe(
      catchError(this.errorHandler)
    )

  }
  facultad(idFacultad:number): Observable<any> {
    return this.httpClient.get(this.apiURL+'/facultad/'+idFacultad)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  plan(idCarrera: number): Observable<any> {
    return this.httpClient.get(this.apiURL+'/planes/'+idCarrera)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  filtrotabla(link:CargaAcademica1): Observable<any> {
    return this.httpClient.post<any>(`${this.apiURL}/filtro/`, link, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
 
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}  `;
    }
    return throwError(errorMessage);
 }
}
