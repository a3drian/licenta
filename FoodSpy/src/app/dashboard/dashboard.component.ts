import { Component, OnInit } from '@angular/core';
import { IMeal } from '../interfaces/IMeal';
import { MealsService } from '../services/meals.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isInDebugMode: boolean = true;

  USER_EMAIL = 'add-meal@email.com';

  meals: any;
  mealsColumns: string[] = [
    'id',
    'email',
    'type',
    'foods',
    'createdAt',
    'details'
  ];

  constructor(
    private mealsService: MealsService
  ) { }

  ngOnInit(): void {
    this.mealsService
      .getMealsByEmail(this.USER_EMAIL)
      .subscribe(
        (meals) => {
          this.meals = meals;
        }
      )
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.mealsColumns = this.mealsColumns.slice(2);
    }
  }

}
