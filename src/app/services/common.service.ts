import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
//import { Subject} from "rxjs/Subject";
//import 'rxjs/add/operator/map';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class CommonBaseService {
  constructor(private http : HttpClient) {}

  getCoronaCases(){
    return this.http.get("https://api.covid19india.org/v4/timeseries.json")
    .pipe(map(res => res));
  }
  
}
