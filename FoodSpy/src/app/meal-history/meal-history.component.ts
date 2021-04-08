import { Component, OnInit } from '@angular/core';
import { MealsService } from '../services/meals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeal } from '../interfaces/IMeal';
import { Meal } from '../models/Meal';
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

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
        log('meal-history.ts', 'constructor()', 'params:', params);
        this.mealId = params.id ? params.id : '0';
      }
    );

    if (this.mealId === '0') {
    } else {
      this.mealsService
        .getMealById(this.mealId)
        .subscribe(
          (data) => {
            log('meal-history.ts', 'constructor()', '(data), data:', data);
            this.idNotFound = false;
            log('meal-history.ts', 'constructor()', '(data), this.idNotFound:', this.idNotFound);

          },
          (error) => {
            log('meal-history.ts', 'constructor()', '(error), error:', error);

            if (error.status === 404) {
              this.idNotFound = true;
            }
            log('meal-history.ts', 'constructor()', '(error) this.idNotFound:', this.idNotFound);
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
