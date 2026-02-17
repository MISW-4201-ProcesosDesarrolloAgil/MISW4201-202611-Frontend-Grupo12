import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ProyectoFrontend';
  private routerEventsSub?: Subscription;
  private navTimerLabels = new Map<number, string>();

  constructor(private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.routerEventsSub = this.router.events
      .pipe(filter((event) =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          const label = `route:${event.id}:${event.url}`;
          this.navTimerLabels.set(event.id, label);
          console.time(label);
          return;
        }

        if (event instanceof NavigationEnd) {
          const label = this.navTimerLabels.get(event.id);
          if (label) {
            console.timeEnd(label);
            this.navTimerLabels.delete(event.id);
          }
          return;
        }

        if (event instanceof NavigationCancel || event instanceof NavigationError) {
          const label = this.navTimerLabels.get(event.id);
          if (label) {
            console.timeEnd(label);
            this.navTimerLabels.delete(event.id);
          }
        }

        if (event instanceof NavigationError) {
          this.toastr.error('No pudimos cargar el modulo. Intenta de nuevo.', 'Error', { closeButton: true });
          console.error(event);
        }
      });
  }

  ngOnDestroy(): void {
    this.routerEventsSub?.unsubscribe();
  }
}
