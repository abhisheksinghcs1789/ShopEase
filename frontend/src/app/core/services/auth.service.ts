import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments';
import { User } from '../models/models';

const TOKEN_KEY = 'shopease_token';
const USER_KEY = 'shopease_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal instead of a BehaviorSubject - lets templates read currentUser()
  // directly without an async pipe, and keeps the navbar reactive to login/logout.
  currentUser = signal<User | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  register(name: string, email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http
      .post<{ user: User; token: string }>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(tap((res) => this.persistSession(res.user, res.token)));
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http
      .post<{ user: User; token: string }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.persistSession(res.user, res.token)));
  }

  private persistSession(user: User, token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }
}
