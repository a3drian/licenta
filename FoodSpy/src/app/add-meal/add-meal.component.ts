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
import { IFood } from '../interfaces/IFood';
import { IMeal } from '../interfaces/IMeal';
import { IIntake } from '../interfaces/IIntake';
import { Intake } from '../models/Intake';
import { IUser } from '../interfaces/IUser';
// Components:
import { EditFoodDialogueComponent } from './edit-food-dialogue/edit-food-dialogue.component';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

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

  private initializeIntake() {
    const initalMeals: IMeal[] = [];
    this.intake = new Intake({
      email: this.authenticatedUserEmail,
      meals: initalMeals,
      createdAt: this.today,
    });
  }

  ngOnDestroy(): void {
    // this.dialogueSubscription.unsubscribe();
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

  private populateMeal(): void {
    const mealFromForm = this.addMealForm.value;
    this.meal.type = mealFromForm.mealType ? mealFromForm.mealType : '';
    this.meal.foods = this.addedFoods;
    log('add-meal.component.ts', this.populateMeal.name, 'mealFromForm:', mealFromForm);
    log('add-meal.component.ts', this.populateMeal.name, 'this.meal', this.meal);
  }

  onSubmit(): void {
    this.populateMeal();
    /*
    this.meal.createdAt = this.today;
    this.mealsService
      .addMeal(this.meal)
      .subscribe();
    */

    this.meal.createdAt = this.today;
    this.intake.meals.push(this.meal);

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
  }

  canShowIntakeHistoryButton(): boolean {
    if (!this.isLoading) {
      if (this.intake.meals.length === 0) {
        return false;
      }
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
        console.log('element:', element);
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
