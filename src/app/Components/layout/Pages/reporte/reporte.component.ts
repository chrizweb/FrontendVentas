import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MAT_DATE_FORMATS } from "@angular/material/core";
import * as moment from 'moment';
import * as XLSX from "xlsx";

import { Reporte } from "../../../../Interfaces/reporte";
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
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers:[
    { provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit {

  filterForm:FormGroup
  salesListReport:Reporte[]=[]
  tableColumns:string[]=['fechaRegistro','numeroVenta','tipoPago','producto','cantidad','precio','total']
  salesDataReport = new MatTableDataSource(this.salesListReport)
  @ViewChild(MatPaginator) paginateTable!:MatPaginator

  constructor(
    private formBuilder:FormBuilder,
    private saleService:VentaService,
    private utilityService:UtilidadService 
  ) {
    this.filterForm  = this.formBuilder.group({
      fechaInicio:['',Validators.required],
      fechaFin:['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.salesDataReport.paginator = this.paginateTable
  }

  searchSales(){
    const fecha_inicio = moment(this.filterForm.value.fechaInicio)
    .format('DD/MM/YYYY')
    const fecha_fin  = moment(this.filterForm.value.fechaFin)
    .format('DD/MM/YYYY')

    if(fecha_inicio === 'invalid data' || fecha_fin === 'invalid data'){
      this.utilityService.showAlert('Debe ingresar ambas fechas','Oops!')
      return
    }
    this.saleService.report(fecha_inicio, fecha_fin).subscribe({
      next:(data) =>{
        if(data.status){
          this.salesListReport = data.value
          this.salesDataReport.data = data.value
        }else{
          this.salesListReport = []
          this.salesDataReport.data = []
          this.utilityService.showAlert('No se encontraron datos','Oops!')
        }
      },
      error:(e) =>{
        console.log(e)
      }
    })
  }

  exportExcel(){
    /*Exportar excel atraves de un array*/
    const book = XLSX.utils.book_new()
    const sheet = XLSX.utils.json_to_sheet(this.salesListReport) 

    XLSX.utils.book_append_sheet(book, sheet, 'Reporte')
    XLSX.writeFile(book, 'Reporte Ventas.xlsx')
  }

}
