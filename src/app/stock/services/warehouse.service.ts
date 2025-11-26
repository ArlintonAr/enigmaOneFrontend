import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { Observable } from 'rxjs';
import { APIResponseWarehouse, APIResponseWarehouseUpdated, WarehouseCreateDTO } from '../interfaces/APIResponseWarehouse';

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() { }

  getAllWarehouses(): Observable<APIResponseWarehouse> {
    {
      const token = localStorage.getItem('token');

      return this.http.get<APIResponseWarehouse>(`${this.baseUrl}/warehouses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  }

  createWarehouse(warehouse: WarehouseCreateDTO): Observable<APIResponseWarehouse> {
    const token = localStorage.getItem('token')

    return this.http.post<APIResponseWarehouse>(
      `${this.baseUrl}/warehouses/createWarehouse`,
      warehouse,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  updateWarehouse(id: number, warehouse: WarehouseCreateDTO): Observable<APIResponseWarehouseUpdated> {
    const token = localStorage.getItem('token')

    return this.http.put<APIResponseWarehouseUpdated>(
      `${this.baseUrl}/warehouses/updateWarehouse/${id}`,
      warehouse,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  deleteWarehouse(id: number): Observable<APIResponseWarehouse> {
    const token = localStorage.getItem('token')

    return this.http.delete<APIResponseWarehouse>(
      `${this.baseUrl}/warehouses/deleteWarehouse/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

}
