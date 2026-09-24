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
  isLoading = signal(false);

  onLogin(): void {

    this.loginError.set('');
    this.isLoading.set(true);

    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.isLoading.set(false);

        if (error.status === 401) {
          this.loginError.set(
            'Invalid email or password. Please try again.'
          );
        } else {
          this.loginError.set(
            'Unable to connect to the server. Please try again later.'
          );
        }
      }

    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(
      visible => !visible
    );
  }
}


