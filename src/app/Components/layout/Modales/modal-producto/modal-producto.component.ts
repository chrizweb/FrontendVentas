import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Categoria } from "../../../../Interfaces/categoria";
import { Producto } from "../../../../Interfaces/producto";
import { CategoriaService } from "../../../../Services/categoria.service";
import { ProductoService } from "../../../../Services/producto.service";
import { UtilidadService } from '../../../../Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements OnInit {

  formProduct:FormGroup
  titleAction:string = 'Agregar'
  buttonAction:string = 'Guardar'
  listCategorias:Categoria[]=[]

  constructor(
    private modalActual:MatDialogRef<ModalProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProduct:Producto,
    private formBuilder:FormBuilder, 
    private categoriaService:CategoriaService,
    private productoService:ProductoService,
    private utilidadService:UtilidadService
  ) {
    this.formProduct = this.formBuilder.group({
      nombre:['',Validators.required],
      idCategoria:['',Validators.required],
      stock:['',Validators.required],
      precio:['',Validators.required],
      esActivo:['',Validators.required],
    })

    if(this.dataProduct != null){
      this.titleAction = "Editar"
      this.buttonAction = "Actualizar"
    }

    this.categoriaService.list().subscribe({
      next:(data) =>{
        if(data.status) 
        this.listCategorias = data.value
      },
      error:(e)=>{
        console.log(e)
      }
    })
  }

  ngOnInit(): void {
    if(this.dataProduct != null){
      this.formProduct.patchValue({
        nombre:this.dataProduct.nombre,
        idCategoria:this.dataProduct.idCategoria,
        stock:this.dataProduct.stock,
        precio:this.dataProduct.precio,
        esActivo:this.dataProduct.esActivo.toString()
      })
    }
  }

  saveEditProduct(){
    const product:Producto = {
      idProducto:this.dataProduct == null ? 0 : this.dataProduct.idProducto,
      nombre:this.formProduct.value.nombre,
      idCategoria:this.formProduct.value.idCategoria,
      descripcionCategoria:"",
      precio:this.formProduct.value.precio,
      stock:this.formProduct.value.stock,
      esActivo:parseInt(this.formProduct.value.esActivo)
    }
    /*Crear usuario*/
    if(this.dataProduct == null){
      this.productoService.save(product).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El producto fue registrado","Exito")
            this.modalActual.close("true")
          }else{
            this.utilidadService.showAlert("No se pudo registrar el producto","Error")
          }
        },
        error:(e)=>{
          console.log(e)
        }
      })
    }
    /*Editar usuario*/
    else{
      this.productoService.update(product).subscribe({
        next:(data) =>{
          if(data.status){
            this.utilidadService.showAlert("El producto fue editado","Exito")
            this.modalActual.close("true")
          }else{
            this.utilidadService.showAlert("No se pudo editar el producto","Error")
          }
        },
        error:(e)=>{
          console.log(e)
        }
      })
    }
  }

}
