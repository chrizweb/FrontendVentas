import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";

import { ProductoService } from "../../../../Services/producto.service";
import { VentaService } from "../../../../Services/venta.service";
import { UtilidadService } from "../../../../Reutilizable/utilidad.service";

import { Producto } from '../../../../Interfaces/producto';
import { Venta } from "../../../../Interfaces/venta";
import { DetalleVenta } from "../../../../Interfaces/detalle-venta";
import Swal from "sweetalert2";

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listProducts:Producto[]=[]
  listProductFilter:Producto[]=[]

  listProductSale:DetalleVenta[]=[]
  blockButtonRegister:boolean = false 

  /*selectedProduct! Producto guardado temporal*/
  selectedProduct!:Producto
  defaultPayment:string = 'Efectivo'
  totalPayment: number = 0

  productSalesForm:FormGroup
  tableColumns:string[]=["producto","cantidad","precio","total","accion"]
  saleDetailData = new MatTableDataSource(this.listProductSale)

  returnProductFilter(search:any):Producto[]{
    const search_value = typeof search === 'string' ? search.toLocaleLowerCase() : search.nombre.toLocaleLowerCase()

    return this.listProducts.filter(item => item.nombre.toLocaleLowerCase().includes(search_value))
  }

  constructor(
    private formBuilder:FormBuilder,
    private productoService:ProductoService,
    private ventaService:VentaService,
    private utilidadService:UtilidadService
  ) {
    this.productSalesForm = this.formBuilder.group({
      producto:['',Validators.required],
      cantidad:['',Validators.required],
    })

    this.productoService.list().subscribe({
      next:(data) =>{
        if(data.status){
        const list = data.value as Producto[]
        this.listProducts = list.filter(p => p.esActivo == 1 && p.stock > 0)
        } 
      },
      error:(e)=>{
        console.log(e)
      }
    })

    this.productSalesForm.get('producto')?.valueChanges.subscribe(value =>{
      this.listProductFilter = this.returnProductFilter(value)
    })
  
   }
  
  
  ngOnInit(): void {
  }

  showProduct(product:Producto):string{
    return product.nombre
  }

  productForSales(event:any){
    this.selectedProduct = event.option.value
  }

  addProductForSale(){
    const quantity:number = this.productSalesForm.value.cantidad
    const price:number = parseFloat(this.selectedProduct.precio)
    const total:number = quantity * price
    this.totalPayment = this.totalPayment + total
    
    this.listProductSale.push({
      idProducto: this.selectedProduct.idProducto,
      descripcionProducto: this.selectedProduct.nombre,
      cantidad: quantity,
      precioTexto: String(price.toFixed(2)),
      totalTexto: String(total.toFixed(2))
    })
    
    this.saleDetailData = new MatTableDataSource(this.listProductSale)
    this.productSalesForm.patchValue({
      producto:'', 
      cantidad:'',
      
    })
  }

  deleteProduct(det_venta:DetalleVenta){
    this.totalPayment = this.totalPayment - parseFloat(det_venta.totalTexto)
    this.listProductSale = this.listProductSale
    .filter(p => p.idProducto != det_venta.idProducto)
    this.saleDetailData = new MatTableDataSource(this.listProductSale)
  }

  registerSale(){
   if(this.listProductSale.length > 0){

    this.blockButtonRegister = true

    const venta:Venta = {
      tipoPago:this.defaultPayment,
      totalTexto:String(this.totalPayment.toFixed(2)),
      detalleVenta:this.listProductSale
    }

    this.ventaService.register(venta).subscribe({
      next:(response) =>{
        if(response.status){
          this.totalPayment = 0.00
          this.listProductSale = []
          this.saleDetailData = new MatTableDataSource(this.listProductSale)

          Swal.fire({
            icon:'success',
            title:'Venta Registrada!',
            text:`Numero de Venta: ${response.value.numeroDocumento}`
          })
        }else{
          this.utilidadService.showAlert('No se pudo registrar la venta','Oops!')
        }
      },
      complete:() =>{
        this.blockButtonRegister = false
      },
      error:(e) =>{
        console.log(e)
      }
    })

   } 
  }

}
