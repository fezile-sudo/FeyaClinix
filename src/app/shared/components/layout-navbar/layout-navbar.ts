import { Component, output } from '@angular/core';

@Component({
  selector: 'app-layout-navbar',
  standalone: true,
  imports: [],
  templateUrl: './layout-navbar.html',
  styleUrl: './layout-navbar.scss',
})
export class LayoutNavbar {

  toggleSidebar = output<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

}