import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/response-api";
import { Venta } from "../Interfaces/venta";

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private url:string = environment.endpoint + "Venta/"

  constructor(private http:HttpClient) { }

  register(venta:Venta):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}Registrar`, venta)
  }

  historial(buscarPor:string, numeroVenta:string, fechaInicio:string, fechaFin:string):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }

  report(fechaInicio:string, fechaFin:string):Observable<ResponseApi>{ 
    return this.http.get<ResponseApi>(`${this.url}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }
}
