import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { Venta } from 'src/app/Interfaces/venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  registerDate:string = ''
  documentNumber:string = ''
  paymentType:string = ''
  total:string = ''
  saleDetail:DetalleVenta[]=[] 
  tableColumns:string[]=['producto','cantidad','precio','total']

  constructor(@Inject(MAT_DIALOG_DATA) public sale:Venta,) { 
    this.registerDate = sale.fechaRegistro!
    this.documentNumber = sale.numeroDocumento!
    this.paymentType = sale.tipoPago
    this.total = sale.totalTexto
    this.saleDetail = sale.detalleVenta 
  }

  ngOnInit(): void {
  }

}
