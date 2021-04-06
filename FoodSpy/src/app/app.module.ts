import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// App components:
import { DashboardComponent } from './dashboard/dashboard.component';

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
// Frontend:
import { AddMealComponent } from './add-meal/add-meal.component';
import { ScanFoodComponent } from './scan-food/scan-food.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { EditFoodDialogueComponent } from './add-meal/edit-food-dialogue/edit-food-dialogue.component';
import { MealHistoryComponent } from './meal-history/meal-history.component';
import { IntakeHistoryComponent } from './intake-history/intake-history.component';
// Authentication:
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AddMealComponent,
    ScanFoodComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    EditFoodDialogueComponent,
    MealHistoryComponent,
    IntakeHistoryComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
