import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout-navbar',
  standalone: true,
  imports: [],
  templateUrl: './layout-navbar.html',
  styleUrl: './layout-navbar.scss',
})
export class LayoutNavbar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  toggleSidebar = output<void>();

  readonly currentUser = this.authService.currentUser;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
