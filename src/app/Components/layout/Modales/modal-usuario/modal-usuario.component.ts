import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Rol } from "../../../../Interfaces/rol";
import { Usuario } from "../../../../Interfaces/usuario";

import { RolService } from "../../../../Services/rol.service";
import { UsuarioService } from "../../../../Services/usuario.service";
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  formUser:FormGroup
  hidePassword:boolean = true
  titleAction:string = 'Agregar'
  buttonAction:string = 'Guardar'
  listRol:Rol[]=[]

  constructor(
    private modalActual:MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUser:Usuario,
    private formBuilder:FormBuilder,
    private rolService:RolService,
    private usuarioService:UsuarioService,
    private utilidadService:UtilidadService,
  ) { 
    this.formUser = this.formBuilder.group({
      nombreCompleto:['',Validators.required],
      correo:['',Validators.required],
      idRol:['',Validators.required],
      clave:['',Validators.required],
      esActivo:['1',Validators.required]
    })

    if(this.dataUser != null){
      this.titleAction = 'Editar'
      this.buttonAction = 'Actualizar'
    }

    this.rolService.list().subscribe({
      next:(data) =>{
        if(data.status) 
        this.listRol = data.value
      },
      error:(e)=>{
        console.log(e)
      }
    })
  }

  ngOnInit(): void {
    /*Valores obtenidos para editar usuario*/
    if(this.dataUser != null){
      this.formUser.patchValue({
        nombreCompleto:this.dataUser.nombreCompleto,
        correo:this.dataUser.correo,
        idRol:this.dataUser.idRol,
        clave:this.dataUser.clave,
        esActivo:this.dataUser.esActivo.toString()
      })
    }
  }

  saveEditUser(){
    const user:Usuario = {
      idUsuario:this.dataUser == null ? 0 : this.dataUser.idUsuario,
      nombreCompleto:this.formUser.value.nombreCompleto,
      correo:this.formUser.value.correo,
      idRol:this.formUser.value.idRol,
      rolDescripcion:'',
      clave:this.formUser.value.clave,
      esActivo:parseInt(this.formUser.value.esActivo)
    }
    /*Crear usuario*/
    if(this.dataUser == null){
      this.usuarioService.save(user).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El usuario fue registrado","Exito")
            this.modalActual.close("true")
          }else{
            this.utilidadService.showAlert("No se pudo registrar el usuario","Error")
          }
        },
        error:(e)=>{
          console.log(e)
        }
      })
    }
    /*Editar usuario*/
    else{
      this.usuarioService.update(user).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El usuario fue editado","Exito")
            this.modalActual.close("true")
          }else{
            this.utilidadService.showAlert("No se pudo editar el usuario","Error")
          }
        },
        error:(e)=>{
          console.log(e)
        }
      })
    }
  }

}
