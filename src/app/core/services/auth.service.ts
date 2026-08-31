import { Injectable, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface DemoUser extends AuthUser {
  password: string;
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

  private readonly storageKey = 'feyaclinix_auth';

  private readonly demoUsers: DemoUser[] = [
    {
      id: 1,
      name: 'Dr. Fezile Gulwa',
      email: 'admin@feyaclinix.com',
      password: 'Admin@123',
      role: 'Administrator',
      token: 'feyaclinix-admin-demo-token'
    },
    {
      id: 2,
      name: 'Dr. Sikhangele Gulwa',
      email: 'doctor@feyaclinix.com',
      password: 'Doctor@123',
      role: 'Doctor',
      token: 'feyaclinix-doctor-demo-token'
    },
    {
      id: 3,
      name: 'Aphiwe Gulwa',
      email: 'reception@feyaclinix.com',
      password: 'Reception@123',
      role: 'Receptionist',
      token: 'feyaclinix-reception-demo-token'
    }
  ];

  private readonly currentUserSignal =
    signal<AuthUser | null>(this.loadUser());

  readonly currentUser =
    this.currentUserSignal.asReadonly();

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  login(email: string, password: string): boolean {

    const demoUser = this.demoUsers.find(
      user =>
        user.email === email &&
        user.password === password
    );

    if (!demoUser) {
      return false;
    }

    const user: AuthUser = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role
    };

    const session: AuthSession = {
      user,
      token: demoUser.token
    };

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(session)
    );

    this.currentUserSignal.set(user);

    return true;
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

    const storedSession =
      localStorage.getItem(this.storageKey);

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


