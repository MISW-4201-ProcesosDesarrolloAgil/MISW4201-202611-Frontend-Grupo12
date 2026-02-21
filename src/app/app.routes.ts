import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./usuario/usuario-login/usuario-login.component').then(m => m.UsuarioLoginComponent),
    pathMatch: 'full' 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./usuario/usuario-registro/usuario-registro.component').then(m => m.UsuarioRegistroComponent),
    pathMatch: 'full' 
  },
  { 
    path: 'propiedades', 
    loadComponent: () => import('./propiedad/propiedad-lista/propiedad-lista.component').then(m => m.PropiedadListaComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedad/crear', 
    loadComponent: () => import('./propiedad/propiedad-crear/propiedad-crear.component').then(m => m.PropiedadCrearComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedad/editar/:id', 
    loadComponent: () => import('./propiedad/propiedad-editar/propiedad-editar.component').then(m => m.PropiedadEditarComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/reservas', 
    loadComponent: () => import('./reserva/reserva-lista/reserva-lista.component').then(m => m.ReservaListaComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/movimientos', 
    loadComponent: () => import('./movimiento/movimiento-lista/movimiento-lista.component').then(m => m.MovimientoListaComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/movimientos/editar/:id_movimiento', 
    loadComponent: () => import('./movimiento/movimiento-editar/movimiento-editar.component').then(m => m.MovimientoEditarComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/movimientos/crear', 
    loadComponent: () => import('./movimiento/movimiento-crear/movimiento-crear.component').then(m => m.MovimientoCrearComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/reserva/crear', 
    loadComponent: () => import('./reserva/reserva-crear/reserva-crear.component').then(m => m.ReservaCrearComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id/zona/crear', 
    loadComponent: () => import('./zona/zona-crear/zona-crear.component').then(m => m.ZonaCrearComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  { 
    path: 'propiedades/:id_propiedad/reserva/editar/:id_reserva', 
    loadComponent: () => import('./reserva/reserva-editar/reserva-editar.component').then(m => m.ReservaEditarComponent),
    canActivate: [authGuard],
    pathMatch: 'full'
  },
];
