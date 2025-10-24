
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { APIResponseOrder, APIResponseOrders, APIResponseOrdersCreate } from '../interfaces/apiResponseOrders.interfaces';
import { environment } from '../../../environments/environment.dev';
import { DeleteOrderResponse, Order } from '../interfaces/order.interface';
import { MaterialOrder, MaterialOrderCreate, MaterialOrderResponse, MaterialOrderUpdate } from '../interfaces/materialOrder.interface';
import { APIResponseTracking, TrackingResponseUpdated, TrackingUpdate } from '../../trackings/interfaces/ApiResponseTracking';
import { ServiceOrderCreate, ServiceOrderResponseUpdated, ServiceOrderUpdate } from '../interfaces/serviceOrder.interface';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl

  constructor() {

  }


  getAllOrders(): Observable<APIResponseOrders> {
    const token = localStorage.getItem('token')

    return this.http.get<APIResponseOrders>(`${this.baseUrl}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(

    )
  }
  getOrderById(id: number): Observable<APIResponseOrder> {
    const token = localStorage.getItem('token')

    return this.http.get<APIResponseOrder>(`${this.baseUrl}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  getOrdersByEmployee(id:number):Observable<APIResponseOrders>{

    const token = localStorage.getItem('token')
    return this.http.get<APIResponseOrders>(`${this.baseUrl}/orders/ordersByEmployeeId/${id}`,{
      headers :{Authorization: `Bearer ${token}` }
    })

  }

  createOrder(order: Partial<Order>): Observable<APIResponseOrdersCreate> {
    const token = localStorage.getItem('token')
    return this.http.post<APIResponseOrdersCreate>(`${this.baseUrl}/orders/createOrder`,
      order,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  }
  updateOrder(id: number, tracking: Partial<TrackingUpdate>): Observable<TrackingResponseUpdated> {
    const token = localStorage.getItem('token')

    return this.http.patch<TrackingResponseUpdated>(`${this.baseUrl}/trackings/updateTracking/${id}`,
      tracking,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  }
  deleteOrder(id: string): Observable<DeleteOrderResponse> {
    const token = localStorage.getItem('token')
    return this.http.delete<DeleteOrderResponse>(`${this.baseUrl}/orders/deleteOrder/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  }

  createMaterialOrder(orderMaterial: Partial<MaterialOrderCreate>, photo?: File | null): Observable<MaterialOrder> {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('materialOrder', new Blob([JSON.stringify(orderMaterial)], { type: 'application/json' }));
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.post<MaterialOrder>(`${this.baseUrl}/materialOrders/createMaterialOrder`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError((error) => of(error))
    )
  }
  updateMaterialOrder(id: string, orderMaterialUpdate: Partial<MaterialOrderUpdate>, photo?: File | null): Observable<MaterialOrder> {
    const token = localStorage.getItem('token')
    console.log(orderMaterialUpdate)
    const formData = new FormData()
    formData.append('materialOrder', new Blob([JSON.stringify(orderMaterialUpdate)], { type: 'application/json' }));

    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.patch<MaterialOrder>(`${this.baseUrl}/materialOrders/updateMaterialOrder/${id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError((error) => of(error))
    )
  }

  deleteMaterialOrder(id: string): Observable<MaterialOrderResponse> {
    const token = localStorage.getItem('token')
    return this.http.delete<MaterialOrderResponse>(`${this.baseUrl}/materialOrders/deleteMaterialOrder/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  }



  //orden de Servicios
  createServiceOrder(orderService: Partial<ServiceOrderCreate>): Observable<ServiceOrderCreate> {
    const token = localStorage.getItem('token')
    return this.http.post<ServiceOrderCreate>(`${this.baseUrl}/serviceOrders/createServiceOrder`,
      orderService,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError((error) => of(error))
    )
  }

  updateServiceOrder(id: string, orderServiceUpdate: Partial<ServiceOrderUpdate>): Observable<ServiceOrderResponseUpdated> {
    const token = localStorage.getItem('token')
    return this.http.patch<ServiceOrderResponseUpdated>(`${this.baseUrl}/serviceOrders/updateServiceOrder/${id}`,
      orderServiceUpdate,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError((error) => of(error))
    )
  }

  deleteServiceOrder(id: string): Observable<ServiceOrderResponseUpdated> {
    const token = localStorage.getItem('token')
    return this.http.delete<ServiceOrderResponseUpdated>(`${this.baseUrl}/serviceOrders/deleteServiceOrder/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  }

}
