import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KeyValue } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {CommonBaseService} from '../services/common.service';

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

  constructor(private commonService: CommonBaseService){
    this.caseStats = {};
    this.getTotalCasesFromApi();
    this.currentDate = this.formatDate(new Date(),0);
    this.previousDate = this.formatDate(new Date(),1);
    // Preserve original property order
    this.originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
      console.log("aa",a)
      return 0;
    }

    this.orderbyValueAsc = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
      return a.value['dates'][this.currentDate].total.confirmed >
       b.value['dates'][this.currentDate].total.confirmed ? -1 : 
       (a.value['dates'][this.currentDate].total.confirmed >
        b.value['dates'][this.currentDate].total.confirmed) ? 0 : 1  
    }
    
    this.orderbyValueDsc = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
     return a.value['dates'][this.currentDate].total.confirmed > b.value['dates'][this.currentDate].total.confirmed ? 1 :
      (a.value['dates'][this.currentDate].total.confirmed > b.value['dates'][this.currentDate].total.confirmed) ? 0 : -1  
    }
    this.sortOrder = this.originalOrder;
  }

  getTotalCasesFromApi(){
    this.commonService.getCoronaCases().subscribe((response :any)=>{  
      this.caseStats = response;
      console.log("caseStats",this.caseStats)
    //  console.log(response.AN.dates[this.currentDate].total)
      this.getCasesFromResponse();
    },err=>{
      console.log("error in network")
    });
  }

  getCasesFromResponse(){
    this.states  = Object.keys(this.caseStats);
    this.dates = Object.values(this.caseStats);
  }

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
    console.log("dsc",this.sortOrder)
  }
  orderAsc(){
    this.sortOrder = this.orderbyValueAsc;
    console.log("asc",this.sortOrder)
  }

}
