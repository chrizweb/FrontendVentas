import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../Interfaces/menu';
import { MenuService } from '../../Services/menu.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menuList:Menu[]=[]
  userMail:string = ''
  userRole:string = ''

  constructor(
    private router:Router,
    private menuService:MenuService,
    private utilityService:UtilidadService

  ) { }

  ngOnInit(): void {
    const user = this.utilityService.getSesion()
    if(user != null){
      this.userMail = user.correo
      this.userRole = user.rolDescripcion

      this.menuService.list(user.idUsuario).subscribe({
        next:(data) =>{
          if(data.status){
            this.menuList = data.value
          }
        },
        error:(e) =>{
          console.log(e)
        }
      })
    }
  }

  signOut(){
    this.utilityService.deleteSesion()
    this.router.navigate(['login'])
  }

}
