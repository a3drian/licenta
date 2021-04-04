import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFood } from '../../interfaces/IFood';
import { UnitsService } from 'src/app/services/units.service';
import { Food } from 'src/app/models/Food';
import { positiveIntegerValidator } from 'src/app/shared/validators/positiveIntegerValidator';

@Component({
  selector: 'app-edit-food-dialogue',
  templateUrl: './edit-food-dialogue.component.html',
  styleUrls: ['./edit-food-dialogue.component.scss']
})
export class EditFoodDialogueComponent implements OnInit {

  isInDebugMode: boolean = true;

  editFoodForm: FormGroup;

  units: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public food: IFood,
    private dialogReference: MatDialogRef<EditFoodDialogueComponent>,
    private formBuilder: FormBuilder,
    private unitsService: UnitsService
  ) {
    this.editFoodForm = this.formBuilder
      .group(
        {
          quantity: [
            '',
            [Validators.required, positiveIntegerValidator()]
          ],
          unit: ['', Validators.required]
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
      const editedFood = new Food(this.food);
      // need an auxiliary variable to not modify the entry in the table
      const foodFromForm = this.editFoodForm.value;
      editedFood.quantity = foodFromForm.quantity;
      editedFood.unit = foodFromForm.unit;
      this.dialogReference.close(editedFood);
    } else {
      this.dialogReference.close(null);
    }
  }

  isFormValid(): boolean {
    return this.editFoodForm.valid;
  }

}
