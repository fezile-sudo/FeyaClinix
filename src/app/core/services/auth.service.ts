import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

interface AuthSession {
  user: AuthUser;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly storageKey = 'feyaclinix_auth';
  private readonly apiUrl = 'http://localhost:3000/api';

  private readonly currentUserSignal = signal<AuthUser | null>(this.loadUser());

  readonly currentUser = this.currentUserSignal.asReadonly();

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/auth/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap(response => {

          const session: AuthSession = {
            user: response.user,
            token: response.token
          };

          localStorage.setItem(this.storageKey, JSON.stringify(session));

          this.currentUserSignal.set(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {

    const session = this.loadSession();

    return session?.token ?? null;
  }

  private loadUser(): AuthUser | null {

    const session = this.loadSession();

    return session?.user ?? null;
  }

  private loadSession(): AuthSession | null {

    const storedSession = localStorage.getItem(this.storageKey);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthSession;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}



