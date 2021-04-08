import { Component, OnInit } from '@angular/core';
import { MealsService } from '../services/meals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeal } from '../interfaces/IMeal';
import { Meal } from '../models/Meal';
import { Constants } from '../shared/Constants';

@Component({
  selector: 'app-meal-history',
  templateUrl: './meal-history.component.html',
  styleUrls: ['./meal-history.component.scss']
})
export class MealHistoryComponent implements OnInit {

  isInDebugMode: boolean = Constants.isInDebugMode;

  meal: IMeal = <IMeal>{};
  mealId: string = '';
  mealWasFound: boolean = false;
  idNotFound: boolean = false;

  constructor(
    private mealsService: MealsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(
      (params) => {
        console.log('params:', params);
        this.mealId = params.id ? params.id : '0';
      }
    );

    if (this.mealId === '0') {
    } else {
      this.mealsService
        .getMealById(this.mealId)
        .subscribe(
          (data) => {
            console.log('constructor() data:', data);
            this.idNotFound = false;
            console.log('constructor(), (data), this.idNotFound:', this.idNotFound);
          },
          (error) => {
            console.log('constructor(), (error), error:', error);
            if (error.status === 404) {
              this.idNotFound = true;
            }
            console.log('constructor(), (error) this.idNotFound:', this.idNotFound);
          }
        );
    }
  }

  ngOnInit(): void {
    this.mealsService
      .getMealById(this.mealId)
      .subscribe(
        (data) => {
          this.meal = new Meal(data);
          this.mealWasFound = this.meal ? true : false;
        }
      );
  }

}
