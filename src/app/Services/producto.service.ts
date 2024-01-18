import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/response-api";
import { Producto } from "../Interfaces/producto";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url:string = environment.endpoint + "Producto/"

  constructor(private http:HttpClient) { }

  list():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista`)
  }

  save(producto:Producto):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}Guardar`, producto)
  }

  update(producto:Producto):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.url}Editar`, producto)
  }

  delete(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.url}Eliminar/${id}`)
  }

}
