import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { APIResponseEmployee, EmployeeResponse, EmployeeUpdate, EmployeeUpdatedResponse } from '../interfaces/employeeResponse.interface';
import { environment } from '../../../environments/environment.dev';
import { CreateNewEmploye } from '../interfaces/employeeNewCreate.interface';
import { APIResponse } from '../interfaces/apiResponse.interface';


@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private http = inject(HttpClient)
  private baseUrl: string = environment.apiUrl;


  employeesList = signal<EmployeeResponse[]>([]);



  constructor() {

  }




  getAllEmployees(): Observable<EmployeeResponse[]> {
    const token = localStorage.getItem('token')
    return this.http.get<EmployeeResponse[]>(`${this.baseUrl}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .pipe(
        tap((resp) => this.employeesList.set(resp))
      )
  }


  createNewEmployee(newEmployee: Partial<CreateNewEmploye>, photo?:File | null) {
    const token = localStorage.getItem('token')

    const formData = new FormData();
    formData.append('employee',new Blob([JSON.stringify(newEmployee)],{type:'application/json'}));
    if (photo) {
      formData.append('photo', photo);
    }

    return this.http.post<CreateNewEmploye>(`${this.baseUrl}/employees/createEmployee`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).pipe(
      catchError((error: any) => of(error))
    )
  }

  searchEmployeeForName(term:string): Observable<APIResponse> {
    const token = localStorage.getItem('token')

    return this.http.get<APIResponse>(`${this.baseUrl}/employees/searchForTerm/${term}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  searchEmployeeForId(id:number): Observable<EmployeeResponse> {
    const token = localStorage.getItem('token')

    return this.http.get<EmployeeResponse>(`${this.baseUrl}/employees/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  updateEmployee(employee:EmployeeUpdate,id:number,photo?:File| null):Observable<APIResponseEmployee>{
     const token = localStorage.getItem('token')

     const formData = new FormData()
      formData.append('employee', new Blob([JSON.stringify(employee)], { type: 'application/json' }))

    if (photo) {
      formData.append('photo', photo)
    }

     return this.http.patch<APIResponseEmployee>(`${this.baseUrl}/employees/updateEmployee/${id}`,
      formData,
      {
      headers: { Authorization: `Bearer ${token}` }
     }).pipe(

     )

  }


  deleteEmployeeForId(id:number | undefined){
    const token = localStorage.getItem('token')
    return this.http.delete(`${this.baseUrl}/employees/deleteEmployee/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError((error: any) => of(error))
    )
  }


  private handleApiError(): (error: any) => Observable<any> { //si falla cambiar Anya APIResponseStockCreate
    return (error: any) => of({
      data: {},
      status: error.status,
      message: error.error?.message || 'Data no encontrada',
      success: error.success ?? false
    } as APIResponseEmployee) ;
  }
}
