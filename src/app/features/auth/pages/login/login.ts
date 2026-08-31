import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  showPassword = signal(false);
  loginError = signal('');

  onLogin(): void {

    this.loginError.set('');

    const authenticated = this.authService.login(
      this.email,
      this.password
    );

    if (!authenticated) {
      this.loginError.set(
        'Invalid email or password. Please try again.'
      );

      return;
    }

    this.router.navigate(['/dashboard']);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(
      visible => !visible
    );
  }
}

