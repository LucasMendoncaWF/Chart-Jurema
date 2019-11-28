import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ChartOptions, ChartDataSets} from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  ufsList: Object = [];
  municipiosList: Object = [];
  ufModel: string = "";
  municipioModel: string = "";

  ufDisable: boolean = true;
  municipioDisable: boolean = true;

  graficoInfo = [];

  months: Object = {"01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro"};

  constructor(private dataService: DataService) { }

  feedUFS(){
    this.dataService.getSelectsInfo("https://servicodados.ibge.gov.br/api/v1/localidades/estados").subscribe((data: any[])=>{
      this.sortAlphabetically(data);
      this.ufsList = data;
      if(this.ufsList != []){
        this.ufDisable = false;
      }else{
        alert("Erro ao consultar a lista de estados!");
      }
    });  
  }

  feedMunicipios(){
    this.municipioModel = "";
    this.municipioDisable = true;
    this.dataService.getSelectsInfo("http://servicodados.ibge.gov.br/api/v1/localidades/estados/" + this.ufModel +"/municipios").subscribe((data: any[])=>{
      this.sortAlphabetically(data);
      this.municipiosList = data;
      if(this.municipiosList != []){
        this.municipioDisable = false;
      }else{
        alert("Erro ao consultar a lista de municípos!");
      }
    });  
  }

  feedGrafico() {
    this.graficoInfo = [];
    let date = new Date();
    date = new Date(date.setMonth(date.getMonth() - 1));
    const requisicoesBolsa = [];
    const datas = [];
    for(let t = 0; t < 12; t++){
      let mes = date.getMonth() + 1;
      let mesCorreto = mes < 10? "0" + mes : mes;
      let dataCorreta = date.getFullYear() + "" + mesCorreto;
      
      this.graficoInfo.push(this.months[mesCorreto] + "/" + date.getFullYear());
      date = new Date(date.setMonth(date.getMonth() - 1));


      requisicoesBolsa.push(this.dataService.getBolsaData(this.municipioModel, dataCorreta))
      datas.push(dataCorreta);
    }
    let beneficiarios = [], valor = [];
    forkJoin(...requisicoesBolsa).subscribe((bolsa: any[]) => {
        for (let index = 0;index < bolsa.length; index++) {
            beneficiarios.push(bolsa[index][0].quantidadeBeneficiados);
            valor.push(bolsa[index][0].valor);
            console.log(bolsa[index][0].valor + " " + bolsa[index][0].quantidadeBeneficiados + " " + this.municipioModel + " " + datas[index]);
        }
    });  
    this.drawChart(valor, beneficiarios);
  }

  //ordenar em ordem alfabetica
  sortAlphabetically(data){
    data.sort(function(a, b){
      if(a.nome < b.nome) { return -1; }
      if(a.nome > b.nome) { return 1; }
      return 0;
    });
    return data;
  }

  //Contrução do gráfico
  drawChart(valor, beneficiarios){
    console.log(valor);
    let LineChart = new Chart('lineChart', {
      type: 'line',
    data: {
    labels: this.graficoInfo,
    datasets: [{
        label: 'Beneficiários',
        data: beneficiarios,
        fill:false,
        lineTension:0.2,
        borderColor:"white",
        borderWidth: 1
    },{
      label: 'Valor total destinado ao Programa Bolsa Família',
      data: valor,
      fill:false,
      lineTension:0.2,
      borderColor:"red",
      borderWidth: 1
    }
    ]
    }, 
    options: {
    title:{
        text:"Line Chart",
        display:true
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
    }
    });
  }
  
  //init
  ngOnInit() {
    this.feedUFS(); 
  }
}
