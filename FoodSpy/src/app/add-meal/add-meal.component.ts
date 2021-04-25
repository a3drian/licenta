import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// Item filtering:
import { Observable, pipe, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Services:
import { FoodsService } from '../services/foods.service';
import { MealsService } from '../services/meals.service';
import { IntakesService } from '../services/intakes.service';
import { UserService } from '../auth/user.service';
// rxjs:
import { switchMap, tap } from 'rxjs/operators';
// Interfaces:
import { IFood } from 'foodspy-shared';
import { IMeal } from 'foodspy-shared';
import { IIntake } from 'foodspy-shared';
import { Intake } from '../models/Intake';
import { IUser } from 'foodspy-shared';
// Components:
import { EditFoodDialogueComponent } from './edit-food-dialogue/edit-food-dialogue.component';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;

  isAuthenticated: boolean = false;
  authenticatedUserEmail: string = '';

  user: IUser | null = null;

  addMealForm: FormGroup;
  meal: IMeal = <IMeal>{};
  intake: IIntake = <IIntake>{};
  intakeId: string = '';
  existingIntake: boolean = false;
  intakeText: string = '';

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
  today: Date = new Date();

  constructor(
    private foodsService: FoodsService,
    private mealsService: MealsService,
    private intakesService: IntakesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {
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
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.authenticatedUserEmail = this.userService.authenticatedUserEmail;
      log('add-meal.ts', this.ngOnInit.name, 'this.authenticatedUserEmail:', this.authenticatedUserEmail);
    }

    this.intakesService
      .getIntakeByEmailAndCreatedAt(this.authenticatedUserEmail, this.today)
      .subscribe(
        (intake: IIntake) => {
          if (intake) {
            log('add-meal.ts', this.ngOnInit.name, '(intake) intake:', intake);
            this.intake = intake;
            this.existingIntake = true;
            this.intakeId = intake.id;
            this.changeIntakeText();
          } else {
            this.initializeIntake();
            log('add-meal.ts', this.ngOnInit.name, '(!intake) this.intake:', this.intake);
          }
        },
        (error) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.intakesService.subscribe(error):', error);
          this.initializeIntake();
          log('add-meal.ts', this.ngOnInit.name, 'this.intakesService.subscribe(error) this.intake:', this.intake);
        }
      );

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
          this.isLoading = false;
        },
        (error) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.searchTerms.subscribe(error) error:', error);
          this.isLoading = false;
        }
      );
    // Foods
    this.foodsService
      .getFoods()
      .subscribe(
        (data) => {
          if (data) {
            this.databaseFoods = data;
            this.isLoading = false;
          }
        },
        (error) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.foodsService.subscribe(error) error:', error);
          this.isLoading = false;
        }
      );
    // Meals:
    this.mealTypes = this.mealsService
      .getMealTypes()
      .map(
        (meals) => {
          return meals.type;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.dialogueSubscription) {
      log('add-meal.component.ts', this.ngOnDestroy.name, 'Unsubscribing from dialogue subscription...');
      this.dialogueSubscription.unsubscribe();
    }
  }

  private initializeIntake() {
    const initalMeals: IMeal[] = [];
    this.intake = new Intake({
      email: this.authenticatedUserEmail,
      meals: initalMeals,
      createdAt: this.today,
    });
  }

  isFormValid(): boolean {
    const validForm = this.addMealForm.valid;
    const validFoods = this.meal.foods.length !== 0;
    return validForm && validFoods;
  }

  onSelectedMealType(event: MatSelectChange) {
    const mealType: string = event.value;
    log('add-meal.component.ts', this.onSelectedMealType.name, 'mealType:', mealType);
    this.meal.type = mealType;
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

  private populateMeal(): void {
    const mealFromForm = this.addMealForm.value;
    // this.meal.type = mealFromForm.mealType ? mealFromForm.mealType : '';
    this.addedFoods.forEach(
      (addedFood: IFood) => {
        this.meal.foods.push(addedFood);
      }
    );
    this.meal.createdAt = this.today;
    log('add-meal.component.ts', this.populateMeal.name, 'mealFromForm:', mealFromForm);
    log('add-meal.component.ts', this.populateMeal.name, 'this.meal', this.meal);
  }

  async onSubmit(): Promise<void> {
    this.populateMeal();

    // TO DO: existing meal
    const addedMeal = await this.mealsService
      .addMeal(this.meal)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.component.ts', this.onSubmit.name, 'this.mealsService.addMeal.catch(error) error:', error);
        }
      );

    if (!addedMeal) {
      log('add-meal.component.ts', this.onSubmit.name, '!addedMeal');
      return;
    }

    const mealId: string = addedMeal.id;
    if (!mealId) {
      log('add-meal.component.ts', this.onSubmit.name, '!mealId');
      return;
    }

    const mealById = await this.mealsService
      .getMealById(mealId)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.component.ts', this.onSubmit.name, 'this.mealsService.getMealById.catch(error) error:', error);
        }
      );

    if (!mealById) {
      log('add-meal.component.ts', this.onSubmit.name, '!mealById');
      return;
    }

    const mealFromDb: IMeal = mealById;
    if (!mealFromDb.id) {
      log('add-meal.component.ts', this.onSubmit.name, '!mealFromDb.id');
      return;
    }

    this.meal = mealFromDb;
    this.intake.meals.push(this.meal);

    log('add-meal.component.ts', this.onSubmit.name, 'Adding mealFromDb to this.intake, mealFromDb:', mealFromDb);

    /*
    if (this.existingIntake) {
      log('add-meal.component.ts', this.onSubmit.name, 'Editing existing intake, this.intake:', this.intake);
      this.intakesService
        .editIntake(this.intake)
        .subscribe();
    } else {
      log('add-meal.component.ts', this.onSubmit.name, 'Adding new intake, this.intake:', this.intake);
      this.intakesService
        .addIntake(this.intake)
        .subscribe();
    }
    */
  }

  canShowIntakeHistoryButton(): boolean {
    if (!this.isLoading) {
      // if (this.intake.meals.length === 0) {
      return false;
      // }
    }
    return true;
  }

  changeIntakeText(): void {
    if (this.intake.meals.length === 0) {
      this.intakeText = 'No meals added today.';
    } else {
      const meals: string = this.intake.meals.length === 1 ? 'one meal' : `${this.intake.meals.length} meals`;
      console.log('this.intake.meals:', this.intake.meals);
      this.intake.meals.forEach(element => {
        log('add-meal.component.ts', this.changeIntakeText.name, 'element:', element);
      });
      this.intakeText = `Today you had ${meals}.`;
    }
  }

  viewIntakeDetails(): void {
    if (this.isAuthenticated) {
      if (this.intakeId) {
        log('add-meal.ts', this.viewIntakeDetails.name, `Attempting to access intake with id: '${this.intakeId}'`);
        this.router.navigate([`/history/${this.intakeId}`]);
      }
    } else {
      log('add-meal.ts', this.viewIntakeDetails.name, 'User is not authenticated!');
    }
  }

  // Item filtering:
  searchTerms = new Subject<string>();
  searchTerm: string = '';
  search(term: string): void {
    log('add-meal.component.ts', this.search.name, 'Search term:', term);
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

  scanBarcode(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['dashboard/scan']);
    } else {
      log('intakes.ts', this.scanBarcode.name, 'User is not authenticated!');
    }
  }

}
