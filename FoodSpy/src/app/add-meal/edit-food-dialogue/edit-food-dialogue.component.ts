import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Interfaces:
import { IFood, IMealFood } from 'foodspy-shared';
// Models:
import { MealFood } from 'src/app/models/MealFood';
// Services:
import { UnitsService } from 'src/app/services/units.service';
// Validators:
import { foodQuantityValidator } from 'src/app/shared/validators/foodQuantityValidator';
// Shared:
import { Constants } from '../../shared/Constants';

@Component({
  selector: 'app-edit-food-dialogue',
  templateUrl: './edit-food-dialogue.component.html',
  styleUrls: ['./edit-food-dialogue.component.scss']
})
export class EditFoodDialogueComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  buttonText: string = '';
  defaultQuantity: number = 0;
  defaultUnit: string = '';
  minMealQuantity: number = 0;
  maxMealQuantity: number = 0;

  quantityLabel = 'quantity';

  editFoodForm: FormGroup;
  food: IFood;

  units: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public mealFood: IMealFood,
    private dialogReference: MatDialogRef<EditFoodDialogueComponent>,
    private formBuilder: FormBuilder,
    private unitsService: UnitsService
  ) {
    this.food = mealFood.food;
    const qty: number = mealFood.quantity;
    if (qty) {
      this.defaultQuantity = qty;
      this.buttonText = 'Edit food';
    } else {
      this.defaultQuantity = Constants.DEFAULT_QUANTITY;
      this.buttonText = 'Add to meal';
    }
    this.defaultUnit = Constants.DEFAULT_UNIT;
    this.minMealQuantity = Constants.MIN_MEAL_QUANTITY;
    this.maxMealQuantity = Constants.MAX_MEAL_QUANTITY;
    this.editFoodForm = this.formBuilder
      .group(
        {
          quantity: [
            this.defaultQuantity,
            [Validators.required, foodQuantityValidator()]
          ],
          unit: [this.defaultUnit, Validators.required]
        }
      );
  }

  ngOnInit(): void {
    // Units:
    this.units = this.unitsService
      .getUnits()
      .map(
        (meals) => {
          return meals.unit
        }
      );
  }

  saveEditedFood(): void {
    if (this.isFormValid()) {
      const editedMealFood: IMealFood = new MealFood({ mfid: this.mealFood.mfid });
      const foodFromForm = this.editFoodForm.value;
      editedMealFood.quantity = foodFromForm.quantity;
      editedMealFood.unit = foodFromForm.unit;
      this.dialogReference.close(editedMealFood);
    } else {
      this.dialogReference.close(null);
    }
  }

  isFormValid(): boolean {
    return this.editFoodForm.valid;
  }

  isQuantityValid(): boolean {
    return this.editFoodForm.controls[this.quantityLabel].valid;
  }

}
