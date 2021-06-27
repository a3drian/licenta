import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Interfaces:
import { IIntake, IMeal, IMealFood } from 'foodspy-shared';
import { Intake } from '../models/Intake';
import { IUser } from 'foodspy-shared';
// Services:
import { HelperService } from '../services/helper.service';
import { IntakesService } from '../services/intakes.service';
import { UserService } from '../auth/user.service';
// Shared:
import { log } from '../shared/Logger';
import { Constants } from '../shared/Constants';
import { STATUS_CODES } from 'foodspy-shared';

@Component({
  selector: 'app-intake-history',
  templateUrl: './intake-history.component.html',
  styleUrls: ['./intake-history.component.scss']
})
export class IntakeHistoryComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  intakeWasFound: boolean = false;
  idNotFound: boolean = false;
  isLoading: boolean = true;

  errorResponse: HttpErrorResponse | null = null;

  intake: IIntake = <IIntake>{};
  intakeId: string = '';
  mealFoods: IMealFood[] = [];

  energy!: number;
  fats!: number;
  saturates!: number;
  carbohydrates!: number;
  sugars!: number;
  proteins!: number;
  salt!: number;

  // percentage!: number;

  user: IUser | null = null;
  userEmail: string = '';
  userTargetCalories: number = 0;

  constructor(
    private intakesService: IntakesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private helperService: HelperService
  ) {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        log('intake-history.ts', 'constructor()', 'params:', params);
        this.intakeId = params.id ? params.id : '0';
      }
    );

    if (this.intakeId !== '0') {
      this.intakesService
        .getIntakeById(this.intakeId)
        .subscribe(
          (data) => {
            log('intake-history.ts', 'constructor()', '(data), data:', data);
            this.idNotFound = false;
            log('intake-history.ts', 'constructor()', '(data), this.idNotFound:', this.idNotFound);
          },
          (error: HttpErrorResponse) => {
            log('intake-history.ts', 'constructor()', '(error), error:', error);
            if (error.status === STATUS_CODES.NOT_FOUND) {
              this.idNotFound = true;
            }
            log('intake-history.ts', 'constructor()', '(error) this.idNotFound:', this.idNotFound);
            this.isLoading = false;
            this.errorResponse = error;
          }
        );
    } else {
      log('intake-history.ts', 'constructor()', 'this.intakeId === 0');
    }
  }

  public progress: string = 'Loading...';
  public percentage: number = 0;

  fillGraph() {
    this.percentage = this.percentage >= 100 ? 100 : this.percentage;

    const floored: number = Math.floor(this.percentage);
    if (this.percentage - floored >= 0.5) {
      this.percentage = floored + 0.5;
    } else {
      this.percentage = floored;
    }

    if (this.percentage <= 0.1) {
      this.progress = '<1%';
    } else {
      this.progress = this.percentage + '%';
    }
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.userEmail = this.userService.authenticatedUserEmail;
      this.userTargetCalories = this.user.targetCalories;
      log('intake-history.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }
    this.intakesService
      .getIntakeById(this.intakeId)
      .subscribe(
        (data: IIntake) => {
          this.intake = new Intake(data);
          const meals: IMeal[] = this.intake.meals;
          meals.forEach(
            (meal: IMeal) => {
              const mealFoods: IMealFood[] = meal.mealFoods;
              if (mealFoods) {
                mealFoods.forEach(
                  (mealFood: IMealFood) => {
                    this.mealFoods.push(mealFood);
                  });
              }
            });
          this.intakeWasFound = this.intake ? true : false;
          this.isLoading = false;
          const f = this.intakesService.populateIntakeDetails(this.intake);
          if (f) {
            this.energy = f.energy;
            this.fats = f.fats;
            this.saturates = f.saturates
            this.carbohydrates = f.carbohydrates;
            this.sugars = f.sugars
            this.proteins = f.proteins
            this.salt = f.salt;
          }
          this.percentage = this.helperService.getPercentage(this.intake, this.userTargetCalories);
          setTimeout(() => {
            this.fillGraph();
          }, 1000);
        },
        (error: HttpErrorResponse) => {
          log('intake-history.ts', this.ngOnInit.name, 'error:', error);
          this.isLoading = false;
          this.errorResponse = error;
        }
      );
  }

}
