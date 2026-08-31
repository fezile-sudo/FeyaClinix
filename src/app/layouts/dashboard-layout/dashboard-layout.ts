import {
  Component,
  effect,
  inject,
  signal
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { LayoutNavbar } from '../../shared/components/layout-navbar/layout-navbar';
import { LayoutSidebar } from '../../shared/components/layout-sidebar/layout-sidebar';

import { AppearanceService } from '../../features/settings/services/appearance.service';


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
export class DashboardLayout {

  private appearanceService = inject(AppearanceService);


  sidebarCollapsed = signal(false);


  constructor() {

    effect(() => {

      const appearance = this.appearanceService.appearanceSettings();

      this.sidebarCollapsed.set(appearance.sidebar === 'compact');

    });

  }


  toggleSidebar() {

    this.sidebarCollapsed.update(
      value => !value
    );

  }

}
