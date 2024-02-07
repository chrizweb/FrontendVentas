import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  tableColumns:string[]=['nombreCompleto','correo','rolDescripcion','estado','acciones']
  startData:Usuario[]=[]
  dataListUsers = new MatTableDataSource(this.startData)
  @ViewChild(MatPaginator)paginateTable!:MatPaginator

  constructor(
    private matDialog:MatDialog,
    private usuarioService:UsuarioService,
    private utilidadService:UtilidadService
  ) { }

  getUsers(){
    this.usuarioService.list().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataListUsers.data = data.value
        }else{
          this.utilidadService.showAlert("No se encontraron datos","Oops!")
        }
      },
      error:(e) =>{
        console.log(e)
      }
    })
  }

  ngOnInit(): void {
    this.getUsers()
  }

  ngAfterViewInit(): void {
    this.dataListUsers.paginator = this.paginateTable
  }

  tableFilter(event:Event){
    const filter_value = (event.target as HTMLInputElement).value
    this.dataListUsers.filter = filter_value.trim().toLowerCase()
  }

  newUser(){
    this.matDialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(response =>{
      if(response === "true"){
        this.getUsers()
      }
    })
  }

  editUser(user:Usuario){
    this.matDialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data:user
    }).afterClosed().subscribe(response =>{
      if(response === "true"){
        this.getUsers()
      }
    })
  }

  deleteUser(user:Usuario){
   Swal.fire({
    title:'¿Desea eliminar el usuario?',
    text:user.nombreCompleto,
    icon:'warning',
    confirmButtonColor:'#e74c3c',
    confirmButtonText:'Si, eliminar',
    showCancelButton:true,
    cancelButtonColor:'#3498db',
    cancelButtonText:'No, volver'
   }).then((response) =>{
    if(response.isConfirmed){
      this.usuarioService.delete(user.idUsuario).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El usuario fue eliminado","Listo!")
            this.getUsers()
          }else{
            this.utilidadService.showAlert("No se pudo eliminar el usuario","Error!")
          }
        },
        error:(e) =>{
          console.log(e)
        }
      })
    }
   })
  }

}
