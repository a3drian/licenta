import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { ScanFoodComponent } from './scan-food/scan-food.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }, // home page
  { path: 'add', component: AddMealComponent },
  { path: 'add/scan', component: ScanFoodComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
