import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { ScanFoodComponent } from './scan-food/scan-food.component';
import { AuthComponent } from './auth/auth.component';
import { IntakesComponent } from './intakes/intakes.component';
import { IntakeHistoryComponent } from './intake-history/intake-history.component';
import { AuthGuardService } from './auth/auth.guard';

/*
const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }, // home page
  // { path: '', component: AuthComponent, pathMatch: 'full' }, // authentication page
  // { path: 'dashboard', component: DashboardComponent }, // home page
  {
    path: 'add', component: AddMealComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'scan', component: ScanFoodComponent }
    ]
  },
  { path: 'add/scanz', component: ScanFoodComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'history/:id', component: IntakeHistoryComponent,
    canActivate: [AuthGuardService]
  },
  // { path: '**', redirectTo: '' }
];
*/

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', component: IntakesComponent },
      { path: 'add', component: AddMealComponent },
      { path: 'scan', component: ScanFoodComponent }
    ]
  },
  {
    path: 'history',
    component: IntakeHistoryComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: ':id',
        component: IntakeHistoryComponent
      }
    ]
  },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
