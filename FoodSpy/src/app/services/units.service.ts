import { Injectable } from '@angular/core';
import { IUnit } from 'foodspy-shared';
import { Unit } from '../models/Unit';

@Injectable({
   providedIn: 'root'
})
export class UnitsService {

   units: IUnit[] = [];

   constructor() {
      this.units =
         [
            new Unit({ unit: 'grams' }),
            // new Unit({ unit: 'pieces' })
         ];
   }

   getUnits(): IUnit[] {
      return this.units;
   }

}