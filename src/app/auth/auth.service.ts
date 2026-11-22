import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private http = inject(HttpClient);

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => this.setToken(response.token))
      );
  }

  logout(): void {
    this.removeToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}