import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  constructor(private commonService: CommonBaseService){
  	this.caseStats = {};
   // this.caseStatsProps.stateName = [];
  	this.getTotalCasesFromApi();
  }

  getTotalCasesFromApi(){
  	this.commonService.getCoronaCases().subscribe(response=>{	
      this.caseStats = response;
      console.log("res from api",this.caseStats)
      this.getCasesFromResponse();
  	},err=>{
  		//alert(1)
  	});
  }

  getCasesFromResponse(){
     // here to get the cases of the current date

   // var val = this.caseStats.find( (item)=> { return item.key == match } );
    //console.log("val",val)
   

  }

}
