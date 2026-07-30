import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  collapsed = input(false);

  menuItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      route: '/dashboard'
    },
    {
      label: 'Doctors',
      icon: '👨‍⚕️',
      route: '/doctors'
    },
    {
      label: 'Patients',
      icon: '👥',
      route: '/patients'
    },
    {
      label: 'Appointments',
      icon: '📅',
      route: '/appointments'
    },
    {
      label: 'Calendar',
      icon: '🗓️',
      route: '/calendar'
    },
    {
      label: 'Reports',
      icon: '📊',
      route: '/reports'
    },
    {
      label: 'Settings',
      icon: '⚙️',
      route: '/settings'
    }
  ];

}