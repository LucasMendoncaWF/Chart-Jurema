import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  public getSelectsInfo(url){
    return this.httpClient.get(url);
  }

  public getBolsaData(municipio, date){
    return this.httpClient.get("http://www.transparencia.gov.br/api-de-dados/bolsa-familia-por-municipio?mesAno="+ date +"&codigoIbge="+ municipio +"&pagina=1");
  }
}
