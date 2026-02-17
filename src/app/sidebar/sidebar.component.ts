import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  collapsed = false;

  constructor(private router: Router) {}

  toggle() {
    this.collapsed = !this.collapsed;
  }

  goTo(path: string, event?: Event) {
    if (event) { event.preventDefault(); }
    this.router.navigate([path]);
  }
}
