import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'] 
})
export class ProductoComponent implements OnInit, AfterViewInit {

  tableColumns:string[]=['nombre','categoria','stock','precio','estado','acciones']
  startData:Producto[]=[]
  dataListProduct = new MatTableDataSource(this.startData)
  @ViewChild(MatPaginator)paginateTable!:MatPaginator

  constructor(
    private matDialog:MatDialog,
    private productoService:ProductoService,
    private utilidadService:UtilidadService
  ) { }

  getProduct(){
    this.productoService.list().subscribe({
      next:(data) =>{
        if(data.status){
          this.dataListProduct.data = data.value
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
    this.getProduct()
  }

  ngAfterViewInit(): void {
    this.dataListProduct.paginator = this.paginateTable
  }

  tableFilter(event:Event){
    const filter_value = (event.target as HTMLInputElement).value
    this.dataListProduct.filter = filter_value.trim().toLowerCase()
  }

  newProduct(){
    this.matDialog.open(ModalProductoComponent,{
      disableClose:true
    }).afterClosed().subscribe(response =>{
      if(response === "true"){
        this.getProduct()
      }
    })
  }

  editProduct(product:Producto){
    this.matDialog.open(ModalProductoComponent,{
      disableClose:true,
      data:product
    }).afterClosed().subscribe(response =>{
      if(response === "true"){
        this.getProduct()
      }
    })
  }

  deleteProduct(product:Producto){
   Swal.fire({
    title:'¿Desea eliminar el producto?',
    text:product.nombre,
    icon:'warning',
    confirmButtonColor:'#e74c3c',
    confirmButtonText:'Si, eliminar',
    showCancelButton:true,
    cancelButtonColor:'#3498db',
    cancelButtonText:'No, volver'
   }).then((response) =>{
    if(response.isConfirmed){
      this.productoService.delete(product.idProducto).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El producto fue eliminado","Listo!")
            this.getProduct()
          }else{
            this.utilidadService.showAlert("No se pudo eliminar el producto","Error!")
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
