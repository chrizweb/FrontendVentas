import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseApi } from "../Interfaces/response-api";

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  private url:string = environment.endpoint + "DashBoard/"

  constructor(private http:HttpClient) { }

  summary():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.url}Resumen`)
  }
}
