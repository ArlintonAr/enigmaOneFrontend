import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { APIResponseTracking, APIResponseTrackingById } from '../interfaces/ApiResponseTracking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  constructor() {}



  getAllTrackings(term:string):Observable<APIResponseTracking> {
    const token = localStorage.getItem('token');
    return this.http.get<APIResponseTracking>(
      `${this.baseUrl}/trackings/byState/${term}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  getTrackingById(id: number): Observable<APIResponseTrackingById> {
    const token = localStorage.getItem('token');
    return this.http.get<APIResponseTrackingById>(
      `${this.baseUrl}/trackings/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }


}
