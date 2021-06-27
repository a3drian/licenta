import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
// Item filtering:
import { Observable, pipe, Subject, Subscription } from 'rxjs';
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
import { IMealFood } from 'foodspy-shared';
import { IIntake } from 'foodspy-shared';
import { IUser } from 'foodspy-shared';
// Models:
import { Intake } from '../models/Intake';
import { MealFood } from '../models/MealFood';
// Components:
import { EditFoodDialogueComponent } from './edit-food-dialogue/edit-food-dialogue.component';
// Shared:
import { Constants } from '../shared/Constants';
import { isValidSearchTerm } from '../shared/validators/searchTermValidator';
import { log } from '../shared/Logger';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;
  // areFoodsLoading: boolean = true;
  // isSearchLoading: boolean = true;
  // foodsLoaded: boolean = false;

  errorResponse: HttpErrorResponse | null = null;

  isAuthenticated: boolean = false;
  userEmail: string = '';
  userTargetCalories: number = 0;

  user: IUser | null = null;

  addMealForm: FormGroup;
  meal: IMeal = <IMeal>{};

  intake: IIntake = <IIntake>{};
  intakeId: string = '';
  existingIntake: boolean = false;
  intakeText: string = '';
  intakeCaloriesConsumed: number = 0;
  intakeCaloriesConsumedText: string = '';

  existingMealInIntake: boolean = false;
  existingMealTypes: string[] = [];
  selectedMealType: string = '';
  hasSearched: boolean = false;

  DASHBOARD_URL: string = Constants.DASHBOARD_URL;
  ADD_MEAL_URL: string = Constants.ADD_MEAL_URL;

  addedMealFoods: IMealFood[] = [];

  databaseFoods: IFood[] = [];
  foodsColumns: string[] = [
    'id',
    'name',
    'energy',
    'fats',
    'carbs',
    'proteins',
    'select'
  ];
  mealTypes: string[] = [];

  dialogueSubscription: Subscription = new Subscription();
  today: Date = new Date();
  showNoResults: boolean = true;

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

    const intialMealFoods: IMealFood[] = [];
    this.meal.mealFoods = intialMealFoods;
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
      this.userEmail = this.userService.authenticatedUserEmail;
      this.userTargetCalories = this.userService.authenticatedUserTargetCalories;
      log('add-meal.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }

    this.intakesService
      .getIntakeByEmailAndCreatedAt(this.userEmail, this.today)
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
            this.intake.mealIDs = intake.mealIDs;
            this.intake.targetCalories = this.userTargetCalories;
          } else {
            this.initializeIntake();
            log('add-meal.ts', this.ngOnInit.name, '(!intake) (intake should be initialized with defaults) this.intake:', this.intake);
          }
          this.isLoading = false;
          this.changeIntakeText();
          this.changeCaloriesConsumedText();
        },
        (error: HttpErrorResponse) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.intakesService.subscribe(error), error:', error);
          this.isLoading = false;
          this.initializeIntake();
          this.errorResponse = error;
          log('add-meal.ts', this.ngOnInit.name, 'this.intakesService.subscribe(error), this.intake:', this.intake);
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
          if (data.length === 0) {
            this.showNoResults = false;
          }
          // this.areFoodsLoading = false;
        },
        (error: HttpErrorResponse) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.searchTerms.subscribe(error) error:', error);
          // this.areFoodsLoading = false;
          this.errorResponse = error;
        }
      );
    // Foods
    // this.getAllFoods();
    this.databaseFoods = [];
    this.hasSearched = false;
    // Meals:
    this.mealTypes = this.mealsService
      .getMealTypes()
      .map(
        (meals) => {
          return meals.type;
        }
      );
    if (this.isInDebugMode) {
      const one = '44d6bc87-0aee-4857-bd92-b9ed82248511';
      this.foodsService
        .getFoodById(one)
        .subscribe(
          (f) => {
            this.addedMealFoods
              .push(
                new MealFood(
                  {
                    mfid: one,
                    quantity: 69,
                    unit: 'grams',
                    food: f
                  }
                )
              )
          }
        );
      const two = '26966e2d-a717-4558-acfc-b2a7dc1d4f55';
      this.foodsService
        .getFoodById(two)
        .subscribe(
          (f) => {
            this.addedMealFoods
              .push(
                new MealFood(
                  {
                    mfid: two,
                    quantity: 96,
                    unit: 'grams',
                    food: f
                  }
                )
              )
          }
        );
    }
  }

  private getAllFoods() {
    this.foodsService
      .getFoods()
      .subscribe(
        (data) => {
          if (data) {
            this.databaseFoods = data;
            // this.foodsLoaded = true;
            // this.isSearchLoading = false;
          }
        },
        (error: HttpErrorResponse) => {
          log('add-meal.ts', this.ngOnInit.name, 'this.foodsService.subscribe(error) error:', error);
          // this.foodsLoaded = false;
          // this.isSearchLoading = false;
          this.errorResponse = error;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.dialogueSubscription) {
      log('add-meal.ts', this.ngOnDestroy.name, 'Unsubscribing from dialogue subscription...');
      this.dialogueSubscription.unsubscribe();
    }
  }

  private initializeIntake() {
    const initalMealIDs: string[] = [];
    const initalMeals: IMeal[] = [];
    this.intake = new Intake({
      email: this.userEmail,
      mealIDs: initalMealIDs,
      meals: initalMeals,
      createdAt: this.today,
      targetCalories: this.userTargetCalories,
      calories: 0
    });
  }

  isFormValid(): boolean {
    const validForm: boolean = this.addMealForm.valid;
    const validFoods: boolean = this.addedMealFoods.length !== 0;
    return validForm && validFoods;
  }

  onSelectedMealType(event: MatSelectChange): void {
    const mealType: string = event.value;
    log('add-meal.ts', this.onSelectedMealType.name, 'mealType:', mealType);
    this.selectedMealType = mealType;
  }

  private openDialog(food: IFood, qty?: number) {
    log('add-meal.ts', this.openDialog.name, 'food:', food);
    const mealFood: IMealFood =
      new MealFood(
        {
          mfid: food.id,
          quantity: qty,
          food: food
        }
      );

    return this.dialog
      .open(
        EditFoodDialogueComponent,
        {
          data: mealFood,
          panelClass: 'custom-dialog-container',
          height: '650px',
          width: '550px'
        }
      );
  }

  editDialog(mealFood: IMealFood, index: number): void {
    log('add-meal.ts', this.editDialog.name, 'Selected mealFood to edit:', mealFood);

    const food: IFood = mealFood.food;
    const qty: number = mealFood.quantity;

    const dialogRef = this.openDialog(food, qty);
    this.dialogueSubscription = dialogRef
      .afterClosed()
      .subscribe(
        (mealFood: IMealFood) => {
          if (mealFood) {
            mealFood.food = food;
            this.addedMealFoods[index] = mealFood;
          }
        }
      );
  }

  addDialog(food: IFood): void {
    log('add-meal.ts', this.addDialog.name, 'Selected food:', food);

    const dialogRef = this.openDialog(food);
    this.dialogueSubscription = dialogRef
      .afterClosed()
      .subscribe(
        (mealFood: IMealFood) => {
          if (mealFood) {
            mealFood.food = food;
            if (this.addedMealFoods.length === 0) {
              this.addFoodFromDialogueToFoodsArray(mealFood);
            } else {
              let index: number = -1;
              for (let i = 0; i < this.addedMealFoods.length; i++) {
                const element = this.addedMealFoods[i];
                if (element.mfid === food.id) {
                  index = i;
                }
              }
              if (index > -1) {
                log('add-meal.ts', this.addDialog.name, 'This food was already added, modifying quantity...');
                let mf: IMealFood = this.addedMealFoods[index];
                mf.quantity += mealFood.quantity;
                this.addedMealFoods[index] = mf;
              } else {
                this.addFoodFromDialogueToFoodsArray(mealFood);
              }
            }
            this.clearSearchBar();
          }
        }
      );
  }

  deleteFoodFromMealFood(index: number): void {
    log('add-meal.ts', this.deleteFoodFromMealFood.name, 'index:', index);
    if (index > -1) {
      this.addedMealFoods.splice(index, 1);
    }
  }

  addFoodFromDialogueToFoodsArray(mealFood: IMealFood): void {
    log('add-meal.ts', this.addFoodFromDialogueToFoodsArray.name, 'MealFood from dialogue:', mealFood);
    this.addedMealFoods.push(mealFood);
    log('add-meal.ts', this.addFoodFromDialogueToFoodsArray.name, 'Added meal foods []:', this.addedMealFoods);
  }

  private addTypeAndCreatedAt(): void {
    const mealFromForm = this.addMealForm.value;
    this.meal.type = this.selectedMealType;
    this.meal.createdAt = this.today;
    log('add-meal.ts', this.addTypeAndCreatedAt.name, 'mealFromForm:', mealFromForm);
    log('add-meal.ts', this.addTypeAndCreatedAt.name, 'this.meal:', this.meal);
  }

  private addIdAndMealFoods(mealFromDb: IMeal): void {
    this.meal.id = mealFromDb.id;
    mealFromDb.mealFoods.forEach(
      (mealFood) => {
        log('add-meal.ts', this.addIdAndMealFoods.name, 'mealFood:', mealFood);
        this.meal.mealFoods.push(mealFood);
      }
    );
    log('add-meal.ts', this.addIdAndMealFoods.name, 'After adding mealFoods, this.meal.id:', this.meal.id);
    log('add-meal.ts', this.addIdAndMealFoods.name, 'After adding mealFoods, this.meal.mealFoods:', this.meal.mealFoods);
  }

  private reloadPage(caller: string): void {
    // reloads the page by navigating silently to 'dashboard'
    this.router
      .navigateByUrl(this.DASHBOARD_URL, { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate([this.ADD_MEAL_URL])
          .catch(
            (error) => {
              log('add-meal.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${this.ADD_MEAL_URL}`, error);
            }
          );
      })
      .catch(
        (error) => {
          log('add-meal.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${this.DASHBOARD_URL}`, error);
        }
      );
  }

  private async getMealById(mealId: string): Promise<IMeal> {
    const mealById = await this.mealsService
      .getMealById(mealId)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.ts', this.onSubmit.name, 'this.mealsService.getMealById.catch(error) error:', error);
        }
      );

    if (!mealById) {
      log('add-meal.ts', this.onSubmit.name, '!mealById');
      return <IMeal>{};
    }

    return mealById;
  }

  private async editMealAndReturnItFromDb(meal: IMeal): Promise<IMeal> {
    const editedMeal = await this.mealsService
      .editMeal(meal)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.ts', this.editMealAndReturnItFromDb.name, 'this.mealsService.editMeal.catch(error) error:', error);
        }
      );

    if (!editedMeal) {
      log('add-meal.ts', this.editMealAndReturnItFromDb.name, '!editedMeal');
      return <IMeal>{};
    }

    const mealId: string = editedMeal.id;
    return await this.getMealById(mealId);
  }

  private async addMealAndReturnItFromDb(meal: IMeal): Promise<IMeal> {
    const addedMeal = await this.mealsService
      .addMeal(meal)
      .toPromise()
      .catch(
        (error) => {
          log('add-meal.ts', this.addMealAndReturnItFromDb.name, 'this.mealsService.addMeal.catch(error) error:', error);
        }
      );

    if (!addedMeal) {
      log('add-meal.ts', this.addMealAndReturnItFromDb.name, '!addedMeal');
      return <IMeal>{};
    }

    const mealId: string = addedMeal.id;
    return await this.getMealById(mealId);
  }

  private async editMealFromIntake(): Promise<void> {
    // need to loop through all existing meals to find the one which matches our (soon to be added) new meal
    let mealToBeEdited: IMeal = <IMeal>{};
    const existingMeals: IMeal[] = this.intake.meals;
    existingMeals.forEach(
      (existingMeal) => {
        if (existingMeal.type === this.selectedMealType) {
          mealToBeEdited = existingMeal;
        }
      }
    );

    // concatenate the two MealFoods[]
    mealToBeEdited.mealFoods = [...mealToBeEdited.mealFoods, ...this.addedMealFoods];
    log('add-meal.ts', this.editMealFromIntake.name, 'Concatenation, mealToBeEdited.mealFoods:', mealToBeEdited.mealFoods);

    // get the original Meal from the db using meal.id
    const mealFromDb: IMeal = await this.getMealById(mealToBeEdited.id);
    log('add-meal.ts', this.editMealFromIntake.name, 'Before, mealById:', mealFromDb);

    // add the concatenated Foods[] to the original Meal
    const editedMealFromDb: IMeal = await this.editMealAndReturnItFromDb(mealToBeEdited);
    log('add-meal.ts', this.editMealFromIntake.name, 'After, editedMealById:', editedMealFromDb);

    // prepare this.meal to be embedded in the existing Intake
    this.addIdAndMealFoods(editedMealFromDb);
  }

  private async addNewMealToIntake(): Promise<void> {
    const mealToBeAdded: IMeal = <IMeal>{ type: this.selectedMealType, mealFoods: this.addedMealFoods, createdAt: this.today };
    const addedMealFromDb: IMeal = await this.addMealAndReturnItFromDb(mealToBeAdded);

    // prepare this.meal to be embedded in the existing Intake
    this.addIdAndMealFoods(addedMealFromDb);

    // add 'Snack' alongside 'Lunch', etc. OR add 'Snack' as the first Meal of a new Intake
    this.intake.mealIDs.push(this.meal.id);
  }

  async onSubmit(): Promise<void> {
    this.addTypeAndCreatedAt();

    let editMeal: boolean = false;
    if (this.existingMealInIntake) {

      // need to check against meal types => edit Meal
      if (this.existingMealTypes.includes(this.selectedMealType)) {

        // same meal type => edit Meal => embed in Intake => edit Intake
        log('add-meal.ts', this.onSubmit.name, 'Adding a meal with the same meal type, this.selectedMealType:', this.selectedMealType);

        // need to loop through all existing meals to find the one which matches our (soon to be added) new meal
        await this.editMealFromIntake();

        editMeal = true;

      } else {

        // different meal type => new Meal => embed in Intake => edit Intake
        log('add-meal.ts', this.onSubmit.name, 'Adding a meal with a different meal type, this.selectedMealType:', this.selectedMealType);

        await this.addNewMealToIntake();
      }

    } else {

      // need to add a new meal type => new Meal => embed in Intake => new Intake
      log('add-meal.ts', this.onSubmit.name, 'Adding a meal with a new meal type, this.selectedMealType:', this.selectedMealType);

      await this.addNewMealToIntake();
    }

    log('add-meal.ts', this.onSubmit.name, 'Adding this.meal to this.intake, this.meal:', this.meal);

    if (editMeal) {
      // no need to modify the existing Intake because it already contains a reference to the edited Meal => reload page
      this.reloadPage(this.onSubmit.name);
    } else {
      if (this.existingIntake) {
        log('add-meal.ts', this.onSubmit.name, 'Editing existing intake, this.intake:', this.intake);
        this.intakesService
          .editIntake(this.intake)
          .subscribe();
      } else {
        log('add-meal.ts', this.onSubmit.name, 'Adding new intake, this.intake:', this.intake);
        this.intakesService
          .addIntake(this.intake)
          .subscribe();
      }

      this.reloadPage(this.onSubmit.name);
    }
  }

  canShowAddedFoods(): boolean {
    return this.addedMealFoods.length > 0;
  }

  canShowIntakeHistoryButton(): boolean {
    if (!this.isLoading) {
      if (this.intake) {  // sometimes this check is made before the intake has been loaded from the db
        if (this.intake.mealIDs) {
          if (this.intake.mealIDs.length !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  changeIntakeText(): void {
    if (!this.isLoading) {
      if (this.intake.mealIDs) {
        if (this.intake.mealIDs.length === 0) {
          this.intakeText = 'No meals added today.';
        } else {
          const meals: string = this.intake.mealIDs.length === 1 ? 'one meal' : `${this.intake.mealIDs.length} meals`;
          log('add-meal.ts', this.changeIntakeText.name, 'this.intake.mealIDs:', this.intake.mealIDs);
          this.intake.mealIDs.forEach(element => {
            log('add-meal.ts', this.changeIntakeText.name, 'element:', element);
          });
          this.intakeText = `Today you had ${meals}.`;
        }
      } else {
        log('add-meal.ts', this.changeIntakeText.name, 'this.intake.mealIDs is not defined');
        this.intakeText = 'No meals added today.';
      }
    }
  }

  changeCaloriesConsumedText(): void {
    if (!this.isLoading) {
      if (this.intake) {
        if (this.intake.calories === 0) {
          this.intakeCaloriesConsumedText = 'No calories burnt today.';
        } else {
          this.intakeCaloriesConsumedText = `Calories burnt: ${this.intake.calories}.`;
        }
      }
    }
  }

  viewIntakeDetails(): void {
    if (this.isAuthenticated) {
      if (this.intakeId) {
        log('add-meal.ts', this.viewIntakeDetails.name, `Attempting to access intake with id: '${this.intakeId}'`);
        const url: string = `/history/${this.intakeId}`;
        this.router
          .navigate([url])
          .catch(
            (error) => {
              log('add-meal.ts', this.viewIntakeDetails.name, `Could not navigate to: ${url}`, error);
            }
          );
      }
    } else {
      log('add-meal.ts', this.viewIntakeDetails.name, 'User is not authenticated!');
    }
  }

  canShowFoodsTable(): boolean {
    if (this.hasSearched) {
      // if (this.foodsLoaded) {
      if (this.databaseFoods) {
        // if (this.databaseFoods.length !== 0) { // cannot use this because the user can search for something that returns 0 results
        return true;
        // }
      }
      // }
    }
    return false;
  }

  hasSearchResults(): boolean {
    let hasResults: boolean = true;
    if (this.hasSearched) {
      if (this.databaseFoods) {
        if (this.databaseFoods.length === 0) {
          hasResults = false;
        }
      }
    };
    return hasResults;
  }

  canSearch(): boolean {
    return true;
  }

  canSelectMealType(): boolean {
    return true;
  }

  canScanBarcode(): boolean {
    return this.canShowFoodsTable();
  }

  // Item filtering:
  searchTerms = new Subject<string>();
  // searchTerm: string = '';
  search(term: string): void {
    log('add-meal.ts', this.search.name, 'Search term:', term);
    if (!isValidSearchTerm(term)) {
      return;
    }
    if (term.length < 3) {
      this.clearSearchBar();
      term = '';
      return;
    }
    // this.searchTerm = term;
    this.searchTerms.next(term);
    this.hasSearched = true;
  }

  private clearSearchBar(): void {
    this.hasSearched = false;
    this.showNoResults = true;
    this.databaseFoods = [];
    // this.search('');
  }

  scanBarcode(): void {
    if (this.isAuthenticated) {
      const url: string = 'dashboard/scan';
      this.router
        .navigate([url])
        .catch(
          (error) => {
            log('add-meal.ts', this.viewIntakeDetails.name, `Could not navigate to: ${url}`, error);
          }
        );
    } else {
      log('intakes.ts', this.scanBarcode.name, 'User is not authenticated!');
    }
  }

}
