import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from "@angular/material/core";
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from "../../Modales/modal-detalle-venta/modal-detalle-venta.component";
import { Venta } from "../../../../Interfaces/venta";
import { VentaService } from "../../../../Services/venta.service";
import { UtilidadService } from "../../../../Reutilizable/utilidad.service";

export const MY_DATA_FORMATS={
  parse:{
    /*Tipo de fecha recibida*/
    dateInput:'DD/MM/YYYY'
  },
  /*Formato de fecha mostrada*/
  display:{
    dateInput:'DD/MM/YYYY',
    /*Texto que mostrara en el calendario*/
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers:[
    { provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  searchForm:FormGroup
  searchOptions:any[]=[
    { value:'fecha', description:'Por fechas' },
    { value:'numero', description:'Numero venta' }
  ]
  tableColumns:string[]=['fechaRegistro','numeroDocumento','tipoPago','total','accion']
  startData:Venta[]=[]
  salesListData = new MatTableDataSource(this.startData)
  @ViewChild(MatPaginator) paginateTable!:MatPaginator

  constructor(
    private formBuilder:FormBuilder,
    private matDialog:MatDialog,
    private saleService:VentaService,
    private utilityService:UtilidadService
  ) {
    this.searchForm = this.formBuilder.group({
      buscarPor:['fecha'],
      numero:[''],
      fechaInicio:[''],
      fechaFin:['']
    })

    this.searchForm.get('buscarPor')?.valueChanges.subscribe(value =>{
      this.searchForm.patchValue({
        numero:'',
        fechaInicio:'',
        fechaFin:''
      })
    })

   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.salesListData.paginator = this.paginateTable
  }

  tableFilter(event:Event){
    const filter_value = (event.target as HTMLInputElement).value
    this.salesListData.filter = filter_value.trim().toLocaleLowerCase()
  }  

  searchSales(){
    let fecha_inicio: string =''
    let fecha_fin: string =''

    if(this.searchForm.value.buscarPor === 'fecha'){
      fecha_inicio = moment(this.searchForm.value.fechaInicio)
      .format('DD/MM/YYYY')
      fecha_fin  = moment(this.searchForm.value.fechaFin)
      .format('DD/MM/YYYY')

      if(fecha_inicio === 'invalid data' || fecha_fin === 'invalid data'){
        this.utilityService.showAlert('Debe ingresar ambas fechas','Oops!')
        return
      }
    }

    this.saleService.historial(
      this.searchForm.value.buscarPor,
      this.searchForm.value.numero,
      fecha_inicio,
      fecha_fin
    ).subscribe({
      next:(data) =>{
      if(data.status){
        this.salesListData = data.value
      }
      else{

        this.utilityService.showAlert('No se encontraron datos','Oops!')
      }
      },
      error:(e) =>{
        console.log(e)
      }
    })
  }

  seeSaleDetail(venta:Venta){
    this.matDialog.open(ModalDetalleVentaComponent,{
      data:venta,
      disableClose:true,
      width:'700px'
    })
  }

}
