import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Login } from '../../Interfaces/login'
import { UsuarioService } from '../../Services/usuario.service'
import { UtilidadService } from '../../Reutilizable/utilidad.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin:FormGroup
  hidePassword:boolean = true
  showLoading:boolean = false
  
  constructor(
    private formBuilder:FormBuilder,
    private router:Router,
    private usuarioService:UsuarioService,
    private utilidadService:UtilidadService
  ) { 
    this.formLogin = this.formBuilder.group({
      email:['', Validators.required],
      password:['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  iniciarSesion():void{
    this.showLoading = true

    const login:Login ={
      correo:this.formLogin.value.email,
      clave:this.formLogin.value.password
    }

    this.usuarioService.loginUser(login).subscribe({
      next:(data) =>{
        if(data.status){
          this.utilidadService.saveSesion(data.value)
          this.router.navigate(["pages"])
        }else{
          this.utilidadService.showAlert("No se encontraron coincidencias","Opps!")
        }
      },
      complete:()=>{
        this.showLoading = false
      },
      error:()=>{
        this.utilidadService.showAlert("Hubo un errror en los datos","Opps!")
      }
    })
  }

}
