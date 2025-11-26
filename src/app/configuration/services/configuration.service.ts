import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.dev";
import { APIResponsePosition, APIResponsePositionById, APIResponsePositionCreate, Position, PositionCreate } from "../interfaces/APIResponsePosition";
import { Observable } from "rxjs";
import { APIResonseDepartments, APIResonseDepartmentsById, APIResonseDepartmentsCreate, DepartmentCreate } from "../interfaces/APIResponseDepartments";
import { APIResponseWarehouses, APIResponseWarehouseById, APIResponseWarehouseCreate, WarehouseCreate } from "../interfaces/APIResponseWarehouse";




@Injectable({ providedIn: 'root' })
export class ConfigurationService {

    private http = inject(HttpClient)
    private baseUrl = environment.apiUrl



    //Position

    getAllPositions(): Observable<APIResponsePosition> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResponsePosition>(`${this.baseUrl}/positions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getPositionById(id: number): Observable<APIResponsePositionById> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResponsePositionById>(`${this.baseUrl}/positions/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    createPosition(position: PositionCreate): Observable<APIResponsePositionCreate> {

        const token = localStorage.getItem('token')

        return this.http.post<APIResponsePositionCreate>(`${this.baseUrl}/positions/createPosition`, position, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updatePosition(id: number, position: PositionCreate): Observable<APIResponsePositionCreate> {

        const token = localStorage.getItem('token')

        return this.http.patch<APIResponsePositionCreate>(`${this.baseUrl}/positions/updatePosition/${id}`, position, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    deletePosition(id: number): Observable<APIResponsePosition> {

        const token = localStorage.getItem('token')

        return this.http.delete<APIResponsePosition>(`${this.baseUrl}/positions/deletePosition/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    //Department

    getAllDepartments(): Observable<APIResonseDepartments> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResonseDepartments>(`${this.baseUrl}/departments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }


    getDepartmentById(id: number): Observable<APIResonseDepartmentsById> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResonseDepartmentsById>(`${this.baseUrl}/departments/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    createDepartment(department: DepartmentCreate): Observable<APIResonseDepartmentsCreate> {

        const token = localStorage.getItem('token')

        return this.http.post<APIResonseDepartmentsCreate>(`${this.baseUrl}/departments/createDepartment`, department, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updateDepartment(id: number, department: DepartmentCreate): Observable<APIResonseDepartmentsCreate> {

        const token = localStorage.getItem('token')

        return this.http.patch<APIResonseDepartmentsCreate>(`${this.baseUrl}/departments/updateDepartment/${id}`, department, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    deleteDepartment(id: number): Observable<APIResonseDepartments> {

        const token = localStorage.getItem('token')

        return this.http.delete<APIResonseDepartments>(`${this.baseUrl}/departments/deleteDepartment/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    //Warehouse

    getAllWarehouses(): Observable<APIResponseWarehouses> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResponseWarehouses>(`${this.baseUrl}/warehouses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    getWarehouseById(id: number): Observable<APIResponseWarehouseById> {

        const token = localStorage.getItem('token')

        return this.http.get<APIResponseWarehouseById>(`${this.baseUrl}/warehouses/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    createWarehouse(warehouse: WarehouseCreate): Observable<APIResponseWarehouseCreate> {

        const token = localStorage.getItem('token')

        return this.http.post<APIResponseWarehouseCreate>(`${this.baseUrl}/warehouses/createWarehouse`, warehouse, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    updateWarehouse(id: number, warehouse: WarehouseCreate): Observable<APIResponseWarehouseCreate> {

        const token = localStorage.getItem('token')

        return this.http.patch<APIResponseWarehouseCreate>(`${this.baseUrl}/warehouses/updateWarehouse/${id}`, warehouse, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    deleteWarehouse(id: number): Observable<APIResponseWarehouses> {

        const token = localStorage.getItem('token')

        return this.http.delete<APIResponseWarehouses>(`${this.baseUrl}/warehouses/deleteWarehouse/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }




}