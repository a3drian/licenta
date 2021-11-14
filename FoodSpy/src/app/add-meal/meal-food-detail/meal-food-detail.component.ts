import { Component, Input, OnInit } from '@angular/core';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Services:
import { MealFoodsService } from 'src/app/services/mealFoods.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-meal-food-detail',
  templateUrl: './meal-food-detail.component.html',
  styleUrls: ['./meal-food-detail.component.scss']
})
export class MealFoodDetailComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public mealFood!: IMealFood;

  constructor(
    private mealFoodsService: MealFoodsService
  ) { }

  ngOnInit(): void {
    const food: IFood = this.mealFoodsService
      .populateMealFoodInfoFromFoodAndQuantity(this.mealFood.food, this.mealFood.quantity);
    this.mealFood.food = food;
  }

}
