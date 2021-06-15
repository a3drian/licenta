import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Material:
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
// HTTP:
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Authentication:
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { UserService } from './auth/user.service';
// App components:
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IntakesComponent } from './intakes/intakes.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { ScanFoodComponent } from './scan-food/scan-food.component';
import { EditFoodDialogueComponent } from './add-meal/edit-food-dialogue/edit-food-dialogue.component';
import { IntakeHistoryComponent } from './intake-history/intake-history.component';
import { HistoryComponent } from './history/history.component';
import { FoodItemComponent } from './intake-history/food-item/food-item.component';
import { MealItemComponent } from './intake-history/meal-item/meal-item.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ErrorResponseComponent } from './shared/error-response/error-response.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { IntakeCardComponent } from './intakes/intake-card/intake-card.component';
import { AddIntakeCardComponent } from './intakes/add-intake-card/add-intake-card.component';
import { IntakesListComponent } from './intakes/intakes-list/intakes-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddMealComponent,
    ScanFoodComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    EditFoodDialogueComponent,
    IntakeHistoryComponent,
    HeaderComponent,
    IntakesComponent,
    HistoryComponent,
    FoodItemComponent,
    MealItemComponent,
    ErrorResponseComponent,
    NotFoundPageComponent,
    IntakeCardComponent,
    AddIntakeCardComponent,
    IntakesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
