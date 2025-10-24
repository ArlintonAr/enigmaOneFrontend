

import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';


import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { AuthResponse } from '../interfaces/responseLogin.interface';
import { rxResource } from '@angular/core/rxjs-interop';


type AuthStatus = "checking" | "authenticated" | "unauthenticated";
const baseUrl = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _authStatus = signal<AuthStatus>("checking");
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);


  public userAuthenticated = signal<User | null>(null); //cambiar esto porque ya existe un _user

  //verifica el estado justo cuando se monta este servicio
  checkAuthStatusResource = rxResource({
    stream: () => this.checkAuthStatus(),
  });

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'Checking';

    if (this._user()) {
      return 'Authenticated';
    }
    return 'Unauthenticated';
  })

  user = computed<User | null>(() => {
    return this._user();
  })

  token = computed(this._token)

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/authentication/login`, { email, password })
      .pipe(
        map(response => this.handleAuthSuccess(response)),
        catchError((error: any) => this.handleAuthError(error))
      );

  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout(); //hace la limpieza
      return of(false);
    }
    return this.http.get<AuthResponse>(`${baseUrl}/authentication/check-status`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => this.handleAuthSuccess(response)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }


  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set("unauthenticated");

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private handleAuthSuccess({ data }: AuthResponse) {
    this._authStatus.set("authenticated");
    this._user.set(data);
    this.userAuthenticated.set(data)
    this._token.set(data.token);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }

}
