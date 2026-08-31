import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
})
export class LayoutSidebar {

  private readonly authService = inject(AuthService);

  collapsed = input(false);

  private readonly allMenuItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      route: '/dashboard',
      roles: ['Administrator', 'Doctor', 'Receptionist']
    },
    {
      label: 'Doctors',
      icon: '👨‍⚕️',
      route: '/doctors',
      roles: ['Administrator']
    },
    {
      label: 'Patients',
      icon: '👥',
      route: '/patients',
      roles: ['Administrator', 'Doctor', 'Receptionist']
    },
    {
      label: 'Appointments',
      icon: '📅',
      route: '/appointments',
      roles: ['Administrator', 'Doctor', 'Receptionist']
    },
    {
      label: 'Calendar',
      icon: '🗓️',
      route: '/calendar',
      roles: ['Administrator', 'Doctor', 'Receptionist']
    },
    {
      label: 'Reports',
      icon: '📊',
      route: '/reports',
      roles: ['Administrator', 'Doctor']
    },
    {
      label: 'Settings',
      icon: '⚙️',
      route: '/settings',
      roles: ['Administrator']
    }
  ];

  readonly menuItems = computed(() => {

    const role = this.authService.currentUser()?.role;

    return this.allMenuItems.filter(item =>
      item.roles.includes(role ?? '')
    );

  });

}
