import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components:
import { DashboardComponent } from './dashboard/dashboard.component';
import { IntakesComponent } from './intakes/intakes.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { ScanFoodComponent } from './scan-food/scan-food.component';
import { HistoryComponent } from './history/history.component';
import { IntakeHistoryComponent } from './intake-history/intake-history.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthComponent } from './auth/auth.component';
// Guards:
import { AuthGuardService } from './auth/auth.guard';

const routes: Routes = [
  // /*
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
    component: HistoryComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: ':id',
        component: IntakeHistoryComponent
      }
    ]
  },
  // */
  { path: 'auth', component: AuthComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
