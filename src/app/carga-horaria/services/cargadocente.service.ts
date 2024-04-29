import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';      
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
   
import { cargadocente } from '../../../interfaces/cargadocente.interface';
@Injectable({
  providedIn: 'root'
})
export class CargadocenteService {
  private apiURL = "http://localhost:3000";   
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
    return this.httpClient.get(this.apiURL + '/cargadocente/')
    .pipe(
      catchError(this.errorHandler)
    )
  } 
  /**
   * Write code on Method
   *
   * @return response()
   */
  create(cargadocente:Cargadocente): Observable<any> {
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
      console.log('no funca')
    } else {
      console.log('no funca1')
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message} hola`;
    }
    return throwError(errorMessage);
 }
}