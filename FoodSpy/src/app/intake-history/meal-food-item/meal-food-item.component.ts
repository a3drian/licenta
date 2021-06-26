import { Component, Input, OnInit } from '@angular/core';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Shared:
import { Constants } from '../../shared/Constants';

@Component({
  selector: 'app-meal-food-item',
  templateUrl: './meal-food-item.component.html',
  styleUrls: ['./meal-food-item.component.scss']
})
export class MealFoodItemComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public mealFood!: IMealFood;
  
  constructor() { }

  ngOnInit(): void { }

}
