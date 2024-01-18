import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/response-api";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private url:string = environment.endpoint + "Menu/"

  constructor(private http:HttpClient) { }

  list(id:number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Lista?idUsuario=${id}`)
  }
}
