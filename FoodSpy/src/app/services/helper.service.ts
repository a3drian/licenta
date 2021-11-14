import { Injectable } from '@angular/core';
// Interfaces:
import { IIntake } from 'foodspy-shared';
// Models:
// Shared:
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';

@Injectable({
   providedIn: 'root'
})
export class HelperService {

   isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

   constructor() { }

   public getFoodValuePerQuantity(foodValue: number, quantity: number): number {
      const value: number = foodValue * quantity / 100;
      return value;
   }

   public getPercentage(intake: IIntake, userTargetCalories: number): number {
      const x = userTargetCalories;
      const y = intake.calories;
      const calories = y / x;
      return calories * 100;
   }
}