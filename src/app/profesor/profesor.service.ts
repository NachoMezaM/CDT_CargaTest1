import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Profesor } from './profesor';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
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
    return this.httpClient.get(this.apiURL + '/profesor/')
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  /**
   * Write code on Method
   *
   * @return response()
   */
  create(profesor:Profesor): Observable<any> {
    return this.httpClient.post(this.apiURL + '/profesor/crear-profe', JSON.stringify(profesor), this.httpOptions)
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
    
    return this.httpClient.get(this.apiURL + '/profesor/' + idProfesor)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  update(idProfesor:number, profesor:Profesor): Observable<any> {
    return this.httpClient.put(this.apiURL + '/profesor/' + idProfesor, JSON.stringify(profesor), this.httpOptions)
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
    return this.httpClient.delete(this.apiURL + '/profesor/' + idProfesor, this.httpOptions)
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
