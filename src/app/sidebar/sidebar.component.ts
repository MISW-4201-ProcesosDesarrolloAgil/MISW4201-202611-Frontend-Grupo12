import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = false;
  activePropiedadId: number | null = null;
  private routerEventsSub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.refreshActivePropiedadId();
    this.routerEventsSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.refreshActivePropiedadId());
  }

  ngOnDestroy() {
    this.routerEventsSub?.unsubscribe();
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  goTo(path: string, event?: Event) {
    if (event) { event.preventDefault(); }
    this.router.navigate([path]);
  }

  get reservasLink(): string[] | null {
    return this.activePropiedadId ? ['/propiedades', String(this.activePropiedadId), 'reservas'] : null;
  }

  get movimientosLink(): string[] | null {
    return this.activePropiedadId ? ['/propiedades', String(this.activePropiedadId), 'movimientos'] : null;
  }

  private refreshActivePropiedadId() {
    const value = sessionStorage.getItem('activePropiedadId');
    const parsed = value ? Number(value) : NaN;
    this.activePropiedadId = Number.isFinite(parsed) ? parsed : null;
  }
}
