import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodsService } from '../services/foods.service';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { IFood } from '../interfaces/IFood';
import { EditFoodDialogueComponent } from './edit-food-dialogue/edit-food-dialogue.component';
import { IMeal } from '../interfaces/IMeal';
import { MealsService } from '../services/meals.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Item filtering:
import { Observable, pipe, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = true;

  addMealForm: FormGroup;
  meal: IMeal = <IMeal>{};

  databaseFoods: IFood[] = [];
  addedFoods: IFood[] = [];
  foodsColumns: string[] = [
    'id',
    'name',
    'qty',
    'unit',
    'select'
  ];
  mealTypes: string[] = [];

  dialogueSubscription: any;

  constructor(
    private foodsService: FoodsService,
    private mealsService: MealsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.addMealForm = this.formBuilder
      .group(
        {
          mealType: ['', Validators.required]
        }
      );
    const initialFoods: IFood[] = [];
    this.meal.foods = initialFoods;
  }

  ngOnInit(): void {
    // Search:
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(
          (term: string) => this.foodsService.search(term)
        )
      )
      .subscribe(
        (data) => {
          this.databaseFoods = data;
        }
      );
    // Foods
    this.foodsService
      .getFood()
      .subscribe(
        (data) => {
          if (data) {
            this.databaseFoods = data;
          }
        }
      );
    // Meals:
    this.mealTypes = this.mealsService
      .getMealTypes()
      .map(
        (meals) => {
          return meals.type
        }
      );
  }

  ngOnDestroy(): void {
    this.dialogueSubscription.unsubscribe();
  }

  isFormValid(): boolean {
    const validForm = this.addMealForm.valid;
    const validFoods = this.meal.foods.length !== 0;
    return validForm && validFoods;
  }


  openDialog(food: IFood) {
    console.log('Selected food:', food);
    const dialogRef = this.dialog
      .open(
        EditFoodDialogueComponent,
        {
          data: food
        }
      );
    this.dialogueSubscription = dialogRef
      .afterClosed()
      .subscribe(
        (food: IFood) => {
          if (food) {
            this.addFoodFromDialogueToMeal(food);
          }
        }
      )
  }

  addFoodFromDialogueToMeal(food: IFood): void {
    console.log('Food from dialogue:', food);
    this.addedFoods.push(food);
    console.log('Added foods []:', this.addedFoods);
    const mealFromForm = this.addMealForm.value;
    this.meal.type = mealFromForm.mealType ? mealFromForm.mealType : '';
    this.meal.foods = this.addedFoods;
    console.log('mealFromForm:', mealFromForm);
    console.log('this.meal', this.meal);
  }

  onSubmit(): void {
    const mealFromForm = this.addMealForm.value;
    this.meal.type = mealFromForm.mealType ? mealFromForm.mealType : '';
    this.meal.foods = this.addedFoods;
    this.meal.email = 'add-meal@email.com';
    this.meal.createdAt = new Date();
    console.log('mealFromForm:', mealFromForm);
    console.log('this.meal', this.meal);
    this.mealsService
      .addMeal(this.meal)
      .subscribe();
  }

  // Item filtering:
  searchTerms = new Subject<string>();
  searchTerm: string = '';
  search(term: string): void {
    console.log('search(term):', term);
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

}
