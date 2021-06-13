import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Constants } from '../Constants';

export function foodQuantityValidator(): ValidatorFn {
   return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
         return null;
      }

      let validType: boolean = false;
      let validValue: boolean = false;
      if (typeof value === 'number') {
         validType = true;
         if (
            value > Constants.MIN_MEAL_QUANTITY &&
            value <= Constants.MAX_MEAL_QUANTITY
         ) {
            validValue = true;
         }
      }

      const valid = validType && validValue;

      return !valid ? { positiveInteger: true } : null;
   }
}