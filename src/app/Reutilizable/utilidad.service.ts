import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private snackBar:MatSnackBar) { }

  showAlert(msg:string, tipo:string){ 
    this.snackBar.open(msg, tipo,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:5000
    })
  }

  saveSesion(sesion:Sesion){
    localStorage.setItem("usuario", JSON.stringify(sesion))
  }

  getSesion(){
    const data = localStorage.getItem("usuario")
    const usuario = JSON.parse(data!)
    return usuario
  }

  deleteSesion(){
    localStorage.removeItem("usuario")
  }

}
