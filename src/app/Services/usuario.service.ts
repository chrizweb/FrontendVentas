import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/response-api";
import { Login } from "../Interfaces/login";
import { Usuario } from "../Interfaces/usuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url:string = environment.endpoint + "Usuario/"

  constructor(private http:HttpClient) { }

  loginUser(login:Login):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}IniciarSesion`, login)
  }

  list():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista`)
  }

  save(usuario:Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}Guardar`, usuario)
  }

  update(usuario:Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.url}Editar`, usuario)
  }

  delete(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.url}Eliminar/${id}`)
  }

}
