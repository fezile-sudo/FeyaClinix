import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutNavbar } from '../../shared/components/layout-navbar/layout-navbar';
import { LayoutSidebar } from '../../shared/components/layout-sidebar/layout-sidebar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    LayoutNavbar,
    LayoutSidebar
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {}
