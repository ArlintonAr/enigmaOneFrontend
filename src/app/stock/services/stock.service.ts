
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, pipe, tap } from 'rxjs';
import { APIResponseStock, APIResponseStockCreate, Stock, StockDeletedResponse, StockUpdate, StockUpdatedResponse } from '../interfaces/APIResponseStock.interface';
import { environment } from '../../../environments/environment.dev';

@Injectable({ providedIn: 'root' })
export class StockService {

  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl



  constructor() { }



  getAllStock(): Observable<APIResponseStock> {
    const token = localStorage.getItem('token')
    return this.http.get<APIResponseStock>(`${this.baseUrl}/stocks`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError((error) => of(error))
    )

  }

  getStockById(id: string): Observable<APIResponseStock> {
    const token = localStorage.getItem('token')

    return this.http.get<APIResponseStock>(`${this.baseUrl}/stocks/searchForId/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => response),
      catchError(this.handleApiError())
    )
  }


  getStockByCode(code: string): Observable<APIResponseStock> {
    const token = localStorage.getItem('token')
    return this.http.get<APIResponseStock>(`${this.baseUrl}/stocks/searchForCode/${code}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(this.handleApiError())
    )
  }


  getStockByName(name: string): Observable<APIResponseStock> {
    const token = localStorage.getItem('token')
    return this.http.get<APIResponseStock>(`${this.baseUrl}/stocks/searchForName/${name}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(this.handleApiError())
    )
  }

  getStockByWarehouseId(warehouseId:number):Observable<APIResponseStock>{
    const token = localStorage.getItem('token')

    return this.http.get<APIResponseStock>(`${this.baseUrl}/stocks/findStockForWarehouseId/${warehouseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(this.handleApiError())
    )
  }

  createStock(stock: Stock, photo?: File | null): Observable<APIResponseStockCreate> {

    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('stock', new Blob([JSON.stringify(stock)], { type: 'application/json' }))

    if (photo) {
      formData.append('photo', photo)
    }

    return this.http.post<APIResponseStockCreate>(`${this.baseUrl}/stocks/createStock`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
    )

  }

  updateStock(stock: Stock, id:number, photo?: File | null): Observable<StockUpdatedResponse> {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('stock', new Blob([JSON.stringify(stock)], { type: 'application/json' }))

    if (photo) {
      formData.append('photo', photo)
    }

    return this.http.patch<StockUpdatedResponse>(`${this.baseUrl}/stocks/updateStock/${id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
    )

  }

  deleteStock(id:number):Observable<StockDeletedResponse>{
    const token = localStorage.getItem('token')

    return this.http.delete<StockDeletedResponse>(`${this.baseUrl}/stocks/deleteStock/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(

    )

  }

  private handleApiError(): (error: any) => Observable<any> { //si falla cambiar Anya APIResponseStockCreate
    return (error: any) => of({
      data: [],
      status: error.status,
      message: error.error?.message || 'Data no encontrada',
      success: error.success ?? false
    } as APIResponseStock);
  }
}
