import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VisualizarCA } from './visualizar-carga';

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
  /**
   * Write code on Method
   *
   * @return response()
   */
  getAll(): Observable<any> {
    return this.httpClient.get(this.apiURL + '/VisualizarCA/')
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  /**
   * Write code on Method
   *
   * @return response()
   */
  create(cargaDocente:VisualizarCA): Observable<any> {
    return this.httpClient.post(this.apiURL + '/VisualizarCA/crear-profe', JSON.stringify(cargaDocente), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  /**
   * Write code on Method
   *
   * @return response()
   */
  find(idProfesor:number): Observable<any> {
    console.log(this.httpClient.get(this.apiURL + '/VisualizarCA/' + idProfesor))
    return this.httpClient.get(this.apiURL + '/VisualizarCA/' + idProfesor)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  update(idProfesor:number, cargaDocente:VisualizarCA): Observable<any> {
    return this.httpClient.put(this.apiURL + '/cargaDocente/' + idProfesor, JSON.stringify(cargaDocente), this.httpOptions)
    .pipe( 
      catchError(this.errorHandler)
    )
  } 
  /**
   * Write code on Method
   *
   * @return response()
   */
  delete(idProfesor:number){
    return this.httpClient.delete(this.apiURL + '/cargaDocente/' + idProfesor, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }      
  /** 
   * Write code on Method
   *
   * @return response()
   */
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;

    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message} `;
    }
    return throwError(errorMessage);
 }
}
