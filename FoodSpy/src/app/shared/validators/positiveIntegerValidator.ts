import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveIntegerValidator(): ValidatorFn {
   return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
         return null;
      }

      let validType: boolean = false;
      let validValue: boolean = false;
      if (typeof value === 'number') {
         validType = true;
         if (value > 0) {
            validValue = true;
         }
      }

      const valid = validType && validValue;

      return !valid ? { positiveInteger: true } : null;
   }
}