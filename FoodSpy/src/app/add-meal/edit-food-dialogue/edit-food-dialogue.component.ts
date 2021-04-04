import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFood } from '../../interfaces/IFood';
import { UnitsService } from 'src/app/services/units.service';

@Component({
  selector: 'app-edit-food-dialogue',
  templateUrl: './edit-food-dialogue.component.html',
  styleUrls: ['./edit-food-dialogue.component.scss']
})
export class EditFoodDialogueComponent implements OnInit {

  isInDebugMode: boolean = true;

  editMealForm: FormGroup;

  units: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public food: IFood,
    private dialogReference: MatDialogRef<EditFoodDialogueComponent>,
    private formBuilder: FormBuilder,
    private unitsService: UnitsService
  ) {
    this.editMealForm = this.formBuilder
      .group(
        {
          quantity: ['', Validators.required],
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
      const editedFood = this.editMealForm.value;
      this.food.quantity = editedFood.quantity;
      this.food.unit = editedFood.unit;
      this.dialogReference.close(this.food);
    } else {
      this.dialogReference.close(null);
    }
  }

  isFormValid(): boolean {
    return this.editMealForm.valid;
  }

}
