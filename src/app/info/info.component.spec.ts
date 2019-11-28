import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DebugElement} from '@angular/core'
import { InfoComponent } from './info.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;
  let de: DebugElement;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoComponent ],
      imports: [
        FormsModule,
        HttpClientTestingModule ,
        ChartsModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return [nome: "a", nome: "b", nome: "c"]', () =>{
    expect(component.sortAlphabetically([{nome: "c"}, {nome: "a"}, {nome: "b"}])).toEqual([{nome: "a"}, {nome: "b"}, {nome: "c"}]);
  })

  it('should get info from api', ()=>{
    expect(component.feedUFS()).toBeTruthy();
    expect(component.feedMunicipios()).toBeTruthy();
    expect(component.feedGrafico()).toBeTruthy();
  });

  it('should feed the chart', ()=>{
    expect(component.drawChart(component.LineChart, [1], [2], ['teste'])).toEqual(1 + 2 + 'teste');
  })
});
