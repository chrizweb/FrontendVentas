import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashBoardService } from '../../../../Services/dash-board.service';

Chart.register(...registerables) 

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  totalRevenues:string = '0'
  totalSales:string = '0'
  totalProducts:string = '0'

  constructor(private dashboardService:DashBoardService) { }

  showGraph(labelGraph:any[], dataGraph:any[]){
    const chartBarras = new Chart('chartBarras',{
      type:'bar',
      data:{
        labels:labelGraph,
        datasets:[{
          label:'Nº de Ventas',
          data:dataGraph,
          backgroundColor:[
            'rgba(54, 162, 235, 0.2)'
          ], 
          borderColor:[
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth:1
        }]
      },
      options:{
        maintainAspectRatio:false,
        responsive:true,
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this.dashboardService.summary().subscribe({
      next:(data) =>{
        if(data.status){
          this.totalRevenues = data.value.totalIngresos
          this.totalSales = data.value.totalVentas
          this.totalProducts = data.value.totalProductos

          const arrayData:any[] = data.value.ventaUltimaSemana

          const labelTemp = arrayData.map((value) => value.fecha)
          const dataTemp = arrayData.map((value) => value.total)
          console.log(labelTemp, dataTemp)

          this.showGraph(labelTemp, dataTemp)
        }
      },
      error:(e) =>{
        console.log(e)
      }
    })
  }

}
