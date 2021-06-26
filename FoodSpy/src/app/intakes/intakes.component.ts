import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
// rxjs:
import { Subscription, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
// Interfaces:
import { IIntake, IUser } from 'foodspy-shared';
// Services:
import { IntakesService } from '../services/intakes.service';
import { UserService } from '../auth/user.service';
// Shared:
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';

@Component({
  selector: 'app-intakes',
  templateUrl: './intakes.component.html',
  styleUrls: ['./intakes.component.scss']
})
export class IntakesComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;
  intakesLoaded: boolean = false;

  errorResponse: HttpErrorResponse | null = null;

  DASHBOARD_URL: string = Constants.DASHBOARD_URL;
  ADD_MEAL_URL: string = Constants.ADD_MEAL_URL;

  user: IUser | null = null;
  isAuthenticated: boolean = false;
  userEmail: string = '';
  userTargetCalories: number = 0;

  currentTime: Date = new Date();
  timeSubscription: Subscription = new Subscription();

  hasConsumed: boolean = false;

  intakes: any;
  intakesColumns: string[] = [
    'id',
    'email',
    'meals',
    'createdAt',
    'details'
  ];

  constructor(
    private intakesService: IntakesService,
    private router: Router,
    private userService: UserService
  ) { }

  private compareDates(x: Date, y: Date): boolean {
    return x.getDate() === y.getDate() && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear();
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.userEmail = this.userService.authenticatedUserEmail;
      this.userTargetCalories = this.userService.authenticatedUserTargetCalories;
      log('intakes.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }
    this.intakesService
      .getIntakesByEmail(this.userEmail)
      .subscribe(
        (intakes) => {
          this.intakes = intakes;
          this.intakesLoaded = true;
          this.isLoading = false;
          const i: IIntake = this.intakes[this.intakes.length - 1];
          const date = new Date(i.createdAt);
          if (this.compareDates(date, this.currentTime)) {
            this.hasConsumed = true;
            log('intakes.ts', this.ngOnInit.name, 'this.hasConsumed:', this.hasConsumed);
          }
        },
        (error: HttpErrorResponse) => {
          log('intakes.ts', this.ngOnInit.name, '(error) error:', error);
          this.intakesLoaded = false;
          this.isLoading = false;
          this.errorResponse = error;
        }
      );
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.intakesColumns = this.intakesColumns.slice(2);
    }

    // Using RxJS Timer
    this.timeSubscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => { this.currentTime = time; });
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  viewIntakeDetails(intakeId: string): void {
    log('intakes.ts', this.viewIntakeDetails.name, `Attempting to access intake with id: '${intakeId}'`);
    if (this.isAuthenticated) {
      const url: string = `/history/${intakeId}`;
      this.router
        .navigate([url])
        .catch(
          (error) => {
            log('intakes.ts', this.viewIntakeDetails.name, `Could not navigate to: ${url}, error:`, error);
          }
        );
    } else {
      log('intakes.ts', this.viewIntakeDetails.name, 'User is not authenticated!');
    }
  }

  private reloadPage(caller: string): void {
    // reloads the page by navigating silently to 'dashboard/add'
    this.router
      .navigateByUrl(this.ADD_MEAL_URL, { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate([this.DASHBOARD_URL])
          .catch(
            (error) => {
              log('intakes.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${this.DASHBOARD_URL}`, error);
            }
          );
      })
      .catch(
        (error) => {
          log('intakes.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${this.ADD_MEAL_URL}`, error);
        }
      );
  }

  deleteIntake(intake: IIntake): void {
    log('intakes.ts', this.deleteIntake.name, `Attempting to delete intake with id: '${intake.id}'`);
    if (this.isAuthenticated) {
      this.intakesService
        .deleteIntake(intake)
        .subscribe(
          () => { },
          (error: HttpErrorResponse) => {
            log('intakes.ts', this.deleteIntake.name, 'Error occurred when deleting intake, error:', error);
            this.errorResponse = error;
          }
        );
      this.reloadPage(this.deleteIntake.name);
    } else {
      log('intakes.ts', this.deleteIntake.name, 'User is not authenticated!');
    }
  }

  addNewMeal(): void {
    if (this.isAuthenticated) {
      const url: string = 'dashboard/add';
      this.router
        .navigate([url])
        .catch(
          (error) => {
            log('intakes.ts', this.addNewMeal.name, `Could not navigate to: ${url}, error:`, error);
          }
        );
    } else {
      log('intakes.ts', this.addNewMeal.name, 'User is not authenticated!');
    }
  }

  canShowIntakesCards(): boolean {
    if (this.intakesLoaded) {
      if (this.intakes) {
        return this.intakes.length !== 0 && !this.isLoading;
      }
    }

    return false;
  }

}
