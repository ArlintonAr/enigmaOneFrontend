import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { HttpClient } from '@angular/common/http';
import { APIMovementResponse, Movement, MovementCreateDTO } from '../interfaces/movement.interface';
import { catchError, Observable, of } from 'rxjs';
import { APIResponse, APIResponseMovements } from '../../employees/interfaces/apiResponse.interface';



@Injectable({ providedIn: 'root' })
export class MovementService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl;



  constructor() { }


  getAllMovements(): Observable<APIResponseMovements> {
    const token = localStorage.getItem('token');

    return this.http.get<APIResponseMovements>(`${this.apiUrl}/movements`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError((response) => of(response))
    )

  }

  getMovementByEmployeeId(employeeId: string | undefined): Observable<APIResponseMovements> {
    const token = localStorage.getItem('token');

    return this.http.get<APIResponseMovements>(`${this.apiUrl}/movements/searchForEmployeeId/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(

      catchError((response) => of(response))
    )

  }
  getMovementById(code:number):Observable<APIResponseMovements>{
    const token = localStorage.getItem('token');

    return this.http.get<APIResponseMovements>(`${this.apiUrl}/movements/${code}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  getMovementByTransactionCode(code:string):Observable<APIResponseMovements>{
    const token = localStorage.getItem('token');
    return this.http.get<APIResponseMovements>(`${this.apiUrl}/movements/searchForTransactionCode/${code}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  getMovementByRequerter(firstName:string):Observable<APIResponseMovements> {
    const token = localStorage.getItem('token');

    return this.http.get<APIResponseMovements>(`${this.apiUrl}/movements/findMovementForRequerter/${firstName}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }



  createMovement(movement: MovementCreateDTO): Observable<APIMovementResponse> {
    const token = localStorage.getItem('token')

    return this.http.post<APIMovementResponse>(`${this.apiUrl}/movements/createMovement`, movement,{
        headers: { Authorization: `Bearer ${token}` }
    });
  }



  //Reportes

  genereteReportForMovementId(id:number): Observable<Blob> {
    const token = localStorage.getItem('token');

    return this.http.get<Blob>(`${this.apiUrl}/movements/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob' as 'json',
    });
  }

}
