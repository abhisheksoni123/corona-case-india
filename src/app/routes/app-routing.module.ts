import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CovidCasesListComponent} from '../covid-cases-list/covid-cases-list.component';

const routes: Routes = [
	{path: '', component: CovidCasesListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
