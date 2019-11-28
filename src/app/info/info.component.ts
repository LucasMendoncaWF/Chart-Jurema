import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { forkJoin } from 'rxjs';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  LineChart: any;
  //Variaveis relacionadas ao HTML
  ufsList: Object = [];
  municipiosList: Object = [];
  ufModel: string = "";
  municipioModel: string = "";
  ufDisable: boolean = true;
  municipioDisable: boolean = true;
  graficoInfo = [];
  beneficiarios = [];
  valor = [];
  //codigo dos meses
  months: Object = {"01": "Janeiro", "02": "Fevereiro", "03": "Março", "04": "Abril", "05": "Maio", "06": "Junho", "07": "Julho", "08": "Agosto", "09": "Setembro", "10": "Outubro", "11": "Novembro", "12": "Dezembro"};

  constructor(private dataService: DataService) { }
  //Alimenta o campo select de estados
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

  //Alimenta o campo select com os municipios de acordo com o estado selecionado
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

  //busca dos dados dos graficos
  feedGrafico() {

    let graficoInfo = [];
    //define os meses das requisições
    let date = new Date();
    date = new Date(date.setMonth(date.getMonth() - 1));
    const requisicoesBolsa = [];
    const datas = [];
    for(let t = 0; t < 12; t++){
      let mes = date.getMonth() + 1;
      let mesCorreto = mes < 10? "0" + mes : mes;
      let dataCorreta = date.getFullYear() + "" + mesCorreto;
      graficoInfo.push(this.months[mesCorreto] + "/" + date.getFullYear());
      date = new Date(date.setMonth(date.getMonth() - 1));
      //faz as requisições
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
        this.drawChart(this.LineChart ,valor, beneficiarios, graficoInfo); 
  });
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

  //envio de dados para o gráfico
  drawChart(chart, valor, beneficiarios, graficoInfo){
    //apaga os dados antigos
    for(let index = 0; index < 12; index++){
      chart.data.labels.pop();
    
      chart.data.datasets[0].data.pop();
      chart.data.datasets[1].data.pop(); 
    }
    //preenche com dados novos
    for(let index = 0; index< 12; index++){
      chart.data.labels.push(graficoInfo[index]);
      chart.data.datasets[0].data.push(beneficiarios[index]);
      chart.data.datasets[1].data.push(valor[index]); 
    }
    chart.update();
  }

  //init
  ngOnInit() {
    this.feedUFS(); 

    this.LineChart = new Chart('lineChart', {
      type: 'line',
    data: {
     labels: this.graficoInfo,
     datasets: [{
         label: 'Número de Beneficiários',
         data: this.beneficiarios,
         fill:false,
         borderColor:"white",
         borderWidth: 1
     },
     {
      label: 'Valor Total Direcionado para o Bolsa Família',
      data: this.valor,
      fill:false,
      borderColor:"red",
      borderWidth: 1
    }]
    }, 
    options: {
     title:{
         text:"Dados do Bolsa Família",
         display:true,
         fontColor: "white",
         fontSize: 20
      }
    }
    });
  }
}
