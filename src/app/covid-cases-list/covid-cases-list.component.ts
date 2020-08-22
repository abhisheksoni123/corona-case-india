import { Component, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { KeyValue } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {CommonBaseService} from '../services/common.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'covid-list-cases',
  templateUrl: './covid-cases-list.html',
  styleUrls: ['./covid-cases-list.scss']
})
export class CovidCasesListComponent {
  title = 'angular-example';
  caseStats : any;
  casesOverall : {};
  resultArray = [];
  states = [];
  dates = [];
  currentDate :string;
  orderbyValueAsc;
  orderbyValueDsc;
  sortOrder;
  originalOrder;
  previousDate : any;
  highcharts: typeof Highcharts;
  chartOptions:any;
  successPopup : any;

  constructor(private commonService: CommonBaseService, private ref: ChangeDetectorRef){
    this.successPopup = true;
    this.caseStats = {};
    this.currentDate = this.formatDate(new Date(),0);
    this.previousDate = this.formatDate(new Date(),1);
    // Preserve original property order and set default order
    this.originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
      return 0;
    }
    // order in ascending order
    this.orderbyValueAsc = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
      return a.value['dates'][this.currentDate].total.confirmed >
       b.value['dates'][this.currentDate].total.confirmed ? -1 : 
       (a.value['dates'][this.currentDate].total.confirmed >
        b.value['dates'][this.currentDate].total.confirmed) ? 0 : 1  
    }
    // order in descending order
    this.orderbyValueDsc = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
     return a.value['dates'][this.currentDate].total.confirmed > b.value['dates'][this.currentDate].total.confirmed ? 1 :
      (a.value['dates'][this.currentDate].total.confirmed > b.value['dates'][this.currentDate].total.confirmed) ? 0 : -1  
    }
    this.sortOrder = this.originalOrder;
    this.getTotalCasesFromApi();
  }

  getTotalCasesFromApi(){
    //get json response from api
    this.commonService.getCoronaCases().subscribe((response :any)=>{  
      this.caseStats = response;
      this.getCasesFromResponse();
    },err=>{
      console.log("error in network")
    });
  }

  getCasesFromResponse(){
    this.states  = Object.keys(this.caseStats);
    this.dates = Object.values(this.caseStats);
  }

  //format date time
  formatDate(date, value) {  
    let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + (d.getDate() - value),
    year = d.getFullYear();

    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;
    return [year, month, day].join('-');
  }

  orderDesc(){
    this.sortOrder = this.orderbyValueDsc;
  }
  orderAsc(){
    this.sortOrder = this.orderbyValueAsc;
  }

  loadChart(name,data){
    this.successPopup = false;
    this.highcharts = Highcharts;
    this.chartOptions = {   
      chart: {
         type: "line"
      },
      title: {
         text: "Total cases"
      },
      subtitle: {
         text: ""
      },
      xAxis:{
         categories:Object.keys(data.dates)
      },
      yAxis: {          
         title:{
            text:"Total Cases"
         } 
      },
      plotOptions: {
         series: {
            dataLabels: {
               enabled: false
            }
         }
      },
      tooltip: {
         valueSuffix:""
      },
      response :{
        rules :[{
          chartOptions : true,
          condition : {
            maxHeight : 300,
            maxWidth : 300
          }
        }]
      },
      series: [{
         name: name,
         data: this.getSeriesData(Object.values(data.dates))
      }]
    };
    Highcharts.chart('container', this.chartOptions);
  }

  getSeriesData(data){
    let seriesArray = [];
    data.map(obj => {
      seriesArray.push(obj.total.confirmed)
    })
     return seriesArray;
  }
  closeModal() {
    this.successPopup = true;
    this.ref.detectChanges();
  }
}
