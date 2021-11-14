import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
// Interfaces:
import { IFood, IMeal } from 'foodspy-shared';
// Services:
import { FoodsService } from 'src/app/services/foods.service';
import { MealsService } from 'src/app/services/meals.service';
// Shared:
import { Constants } from '../../shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.scss']
})
export class MealItemComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;

  @Input()
  public meal!: IMeal;

  foods: IFood[] = [];
  foodIDs: string[] = [];

  constructor(
    private foodService: FoodsService
  ) { }

  ngOnInit(): void {
    this.meal.mealFoods.forEach(
      (mealFood) => {
        this.foodIDs.push(mealFood.mfid);
      }
    );

    this.initializeFoods(this.foodIDs)
      .then(
        () => {
          this.isLoading = false;
        }
      );
  }

  async initializeFoods(foodIDs: string[]): Promise<void> {
    /*
    await Promise.all(
      foodIDs.map(
        (
          async (id) => {
            this.foodService
              .getFoodById(id)
              .subscribe(
                (food: IFood) => {
                  if (food) {
                    this.foods.push(food);
                  }
                },
                (error: HttpErrorResponse) => {
                  log('meal-item.ts', this.initializeFoods.name, 'error:', error);
                }
              )
          }
        )
      )
    );
    */
  }

}
