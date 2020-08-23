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
  previousDate : any;
  highcharts: typeof Highcharts;
  chartOptions:any;
  successPopup : any;

  constructor(private commonService: CommonBaseService, private ref: ChangeDetectorRef){
    this.successPopup = true;
    this.caseStats = {};
    this.currentDate = this.formatDate(new Date(),0);
    this.previousDate = this.formatDate(new Date(),1);
    //highchart init variable
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
         categories:[]
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
      series: []
    };

    this.getTotalCasesFromApi();
  }

  chart
  //ngonit function
  ngOnInit():void{
    this.chart = new (Highcharts.chart as any)('container', this.chartOptions);
    this.chart.update({
      xAxis:{
         categories: []
      },
      series: [{
         name: "",
         data: []
      }]
    });
  }

  stateStats = [];
  getTotalCasesFromApi(){
    //get json response from api
    this.commonService.getCoronaCases().subscribe((response :any)=>{  
      this.caseStats = response;
      for (let value in this.caseStats) {
        this.stateStats.push({
          name: value,
          data: this.caseStats[value],
        });
      }
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

  order = true;
  orderBy() {
    this.order = !this.order;
    let int = this.order ? -1 : 1;
    this.stateStats = this.stateStats.sort((a, b) => {
      if (a.data.dates[this.currentDate]) {
        if (a.data.dates[this.currentDate].total.tested > b.data.dates[this.currentDate].total.tested) {
          return -int;
        }
        if (a.data.dates[this.currentDate].total.tested < b.data.dates[this.currentDate].total.tested) {
          return int;
        }
      }
      return 0;
    });
  }

  loadChart(name,data){
    this.successPopup = false;
    this.highcharts = Highcharts;
    this.chart = new (Highcharts.chart as any)('container', this.chartOptions);
    var xAxisTemp = Object.keys(data.dates);
    var dataTemp = this.getSeriesData(Object.values(data.dates));
    if(xAxisTemp && dataTemp) {
      this.chart.update({
        xAxis:{
           categories: xAxisTemp
        },
        series: [{
           name: name,
           data: dataTemp
        }]
      });
    }
  }

  getSeriesData(data){
    let seriesArray = [];
    data.map(obj => {
      if(obj.total.confirmed)
      seriesArray.push(obj.total.confirmed)
    })
     return seriesArray;
  }
  closeModal() {
    this.chart={};
    this.successPopup = true;
  }
}
