import { Component, OnDestroy, OnInit } from '@angular/core';
import { FoodsService } from '../services/foods.service';
import { switchMap, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { IFood } from '../interfaces/IFood';
import { EditFoodDialogueComponent } from './edit-food-dialogue/edit-food-dialogue.component';
import { IMeal } from '../interfaces/IMeal';
import { IIntake } from '../interfaces/IIntake';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../shared/Constants';
import { MealsService } from '../services/meals.service';
// Item filtering:
import { Observable, pipe, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IUser } from '../interfaces/IUser';
import { UserService } from '../auth/user.service';
import { log } from '../shared/Logger';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.isInDebugMode;

  isAuthenticated: boolean = false;
  private userSubscription: Subscription = new Subscription;
  authenticatedUserEmail: string = '';

  public user: IUser;

  addMealForm: FormGroup;
  meal: IMeal = <IMeal>{};
  day: IIntake = <IIntake>{};

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
    public dialog: MatDialog,
    private userService: UserService
  ) {
    this.user = this.userService.user;
    this.addMealForm = this.formBuilder
      .group(
        {
          mealType: ['', Validators.required]
        }
      );
    const initialFoods: IFood[] = [];
    this.meal.foods = initialFoods;
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.foodsColumns = this.foodsColumns.slice(1);
    }
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
      .getFoods()
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
    this.authenticatedUserEmail = this.user.email;
    log('add-meal.ts', this.constructor.name, 'this.authenticatedUserEmail:', this.authenticatedUserEmail);
  }

  ngOnDestroy(): void {
    // this.dialogueSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  isFormValid(): boolean {
    const validForm = this.addMealForm.valid;
    const validFoods = this.meal.foods.length !== 0;
    return validForm && validFoods;
  }

  openDialog(food: IFood) {
    log('add-meal.component.ts', this.openDialog.name, 'Selected food:', food);

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
    log('add-meal.component.ts', this.addFoodFromDialogueToMeal.name, 'Food from dialogue:', food);
    this.addedFoods.push(food);
    log('add-meal.component.ts', this.addFoodFromDialogueToMeal.name, 'Added foods []:', this.addedFoods);
    this.populateMeal();
  }

  private populateMeal() {
    const mealFromForm = this.addMealForm.value;
    this.meal.type = mealFromForm.mealType ? mealFromForm.mealType : '';
    this.meal.foods = this.addedFoods;
    log('add-meal.component.ts', this.populateMeal.name, 'mealFromForm:', mealFromForm);
    log('add-meal.component.ts', this.populateMeal.name, 'this.meal', this.meal);
  }

  onSubmit(): void {
    this.populateMeal();
    // this.meal.email = 'add-meal@email.com';
    this.meal.createdAt = new Date();
    this.mealsService
      .addMeal(this.meal)
      .subscribe();
  }

  // Item filtering:
  searchTerms = new Subject<string>();
  searchTerm: string = '';
  search(term: string): void {
    log('add-meal.component.ts', this.search.name, 'Search term:', term);
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

}
