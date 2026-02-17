import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    sessionStorage.removeItem('decodedToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('idUsuario');
    sessionStorage.removeItem('activePropiedadId');
    this.router.navigate(['/']);
  }

}
