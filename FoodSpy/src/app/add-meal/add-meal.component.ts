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

  existingMealInIntake: boolean = false;
  existingMealTypes: string[] = [];
  selectedMealType: string = '';

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
            this.existingMealInIntake = true;
            this.intake.meals.forEach((existingMeal: IMeal) => { this.existingMealTypes.push(existingMeal.type) });
            log('add-meal.ts', this.ngOnInit.name, '(intake) this.existingMealTypes:', this.existingMealTypes);
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
    const validFoods = this.addedFoods.length !== 0;
    return validForm && validFoods;
  }

  onSelectedMealType(event: MatSelectChange) {
    const mealType: string = event.value;
    log('add-meal.component.ts', this.onSelectedMealType.name, 'mealType:', mealType);
    this.selectedMealType = mealType;
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
            this.addFoodFromDialogueToFoodsArray(food);
          }
        }
      )
  }

  addFoodFromDialogueToFoodsArray(food: IFood): void {
    log('add-meal.component.ts', this.addFoodFromDialogueToFoodsArray.name, 'Food from dialogue:', food);
    this.addedFoods.push(food);
    log('add-meal.component.ts', this.addFoodFromDialogueToFoodsArray.name, 'Added foods []:', this.addedFoods);
  }

  private populateMeal(): void {
    const mealFromForm = this.addMealForm.value;
    this.meal.foods = this.addedFoods;
    this.meal.createdAt = this.today;
    log('add-meal.component.ts', this.populateMeal.name, 'mealFromForm:', mealFromForm);
    log('add-meal.component.ts', this.populateMeal.name, 'this.meal:', this.meal);
  }

  private async getMealById(mealId: string): Promise<IMeal> {
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
      return <IMeal>{};
    }

    return mealById;
  }

  private async editMealById(meal: IMeal): Promise<IMeal> {
    const editedMeal = await this.mealsService
      .editMeal(meal)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.component.ts', this.editMealById.name, 'this.mealsService.addMeal.catch(error) error:', error);
        }
      );

    if (!editedMeal) {
      log('add-meal.component.ts', this.editMealById.name, '!editedMeal');
      return <IMeal>{};
    }

    const mealId: string = editedMeal.id;
    if (!mealId) {
      log('add-meal.component.ts', this.editMealById.name, '!mealId');
      return <IMeal>{};
    }

    return await this.getMealById(mealId);
  }

  async onSubmit(): Promise<void> {
    this.populateMeal();

    // TO DO: existing meal
    if (this.existingMealInIntake) {
      // need to check against meal types => edit Meal
      if (this.existingMealTypes.includes(this.selectedMealType)) {

        // same meal type => edit Meal => embed in Intake => edit Intake
        log('add-meal.component.ts', this.onSubmit.name, 'Adding a meal with the same meal type, this.selectedMealType:', this.selectedMealType);

        // need to loop through all existing meals to find the one which matches our soon to be added new meal
        let mealToBeEdited: IMeal = <IMeal>{};
        const existingMeals: IMeal[] = this.intake.meals;
        existingMeals.forEach(
          (existingMeal) => {
            if (existingMeal.type === this.selectedMealType) {
              mealToBeEdited = existingMeal;
            }
          }
        );

        // concatenate the two foods arrays
        mealToBeEdited.foods = [...mealToBeEdited.foods, ...this.meal.foods];
        log('add-meal.component.ts', this.onSubmit.name, 'Concatenation, mealToBeEdited.foods:', mealToBeEdited.foods);

        const mealFromDb: IMeal = await this.getMealById(mealToBeEdited.id);
        log('add-meal.component.ts', this.onSubmit.name, 'Before, mealById:', mealFromDb);

        const editedMealFromDb: IMeal = await this.editMealById(mealToBeEdited);
        log('add-meal.component.ts', this.onSubmit.name, 'After, editedMealById:', editedMealFromDb);

        this.meal.foods = editedMealFromDb.foods;
      } else {
        log('add-meal.component.ts', this.onSubmit.name, 'Adding a meal with a different meal type, this.selectedMealType:', this.selectedMealType);
        // different meal type => new Meal => embed in Intake => edit Intake
      }
    } else {
      // need to add a new meal type
    }

    /*
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

    if (!mealFromDb.id) {
      log('add-meal.component.ts', this.onSubmit.name, '!mealFromDb.id');
      return;
    }
    */

    //  const mealFromDb: IMeal = mealById;
    // this.meal = mealFromDb;
    this.intake.meals.push(this.meal);

    // log('add-meal.component.ts', this.onSubmit.name, 'Adding mealFromDb to this.intake, mealFromDb:', mealFromDb);

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
    this.router.navigate(['/dashboard']);
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
      log('add-meal.component.ts', this.changeIntakeText.name, 'this.intake.meals:', this.intake.meals);
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
