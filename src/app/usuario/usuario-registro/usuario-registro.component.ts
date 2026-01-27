import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-usuario-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-registro.component.html',
  styleUrls: ['./usuario-registro.component.css']
})
export class UsuarioRegistroComponent implements OnInit {

  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService
  )
  {
    this.usuarioForm = new FormGroup('')
  }

  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      usuario: ["", [Validators.required, Validators.maxLength(50)]],
      password: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
      confirmPassword: ["", [Validators.required, Validators.maxLength(50), Validators.minLength(4)]]
    });
  }

  registrarUsuario() {
    this.usuarioService.registro(this.usuarioForm.get('usuario')?.value, this.usuarioForm.get('password')?.value)
      .subscribe(res => {
        this.router.navigate([`/`])
      },
        error => {
          this.toastrService.error("Error en el registro. Verifique que el usuario no se encuentre ya registrado", "Error", {closeButton: true});
        })
  }


}
