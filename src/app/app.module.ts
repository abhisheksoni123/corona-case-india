import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './routes/app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonBaseService} from '../app/services/common.service';
import {CovidCasesListComponent} from './covid-cases-list/covid-cases-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CovidCasesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CommonBaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
