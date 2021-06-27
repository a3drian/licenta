import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
// rxjs:
import { Subscription } from 'rxjs';
// Components:
import { ConfirmationDialogueComponent } from 'src/app/shared/components/confirmation-dialogue/confirmation-dialogue.component';
// Interfaces:
import { IIntake, IMeal, IMealFood, IUser } from 'foodspy-shared';
// Services:
import { IntakesService } from 'src/app/services/intakes.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/auth/user.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';

@Component({
  selector: 'app-intake-card',
  templateUrl: './intake-card.component.html',
  styleUrls: ['./intake-card.component.scss']
})
export class IntakeCardComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;

  @Input()
  public intake!: IIntake;

  user: IUser | null = null;
  isAuthenticated: boolean = false;
  userEmail: string = '';
  userTargetCalories: number = 0;

  errorResponse: HttpErrorResponse | null = null;

  percentage: number = 0;

  // intake details:
  fats: number = 0;
  saturates: number = 0;
  carbohydrates: number = 0;
  sugars: number = 0;

  dialogueSubscription: Subscription = new Subscription();

  constructor(
    private intakesService: IntakesService,
    private router: Router,
    private userService: UserService,
    private helperService: HelperService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.userEmail = this.userService.authenticatedUserEmail;
      this.userTargetCalories = this.userService.authenticatedUserTargetCalories;
      log('intake-card.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }
    this.populateIntakeDetails();
    this.percentage = Math.floor(this.helperService.getPercentage(this.intake, this.userTargetCalories));
  }

  ngOnDestroy() {
    if (this.dialogueSubscription) {
      this.dialogueSubscription.unsubscribe();
    }
  }

  openConfirmationDialog(intake: IIntake): void {
    log('intake-card.ts', this.openConfirmationDialog.name, 'Selected intake:', intake);

    const dialogRef = this.dialog
      .open(
        ConfirmationDialogueComponent,
        {
          data: intake.createdAt,
          panelClass: 'custom-confirmation-dialog-container',
          height: '200px',
          width: '400px'
        }
      );
    this.dialogueSubscription = dialogRef
      .afterClosed()
      .subscribe(
        (canDelete: boolean) => {
          log('intake-card.ts', this.openConfirmationDialog.name, 'canDelete:', canDelete);
          if (canDelete) {
            this.deleteIntake(intake);
          }
        }
      );
  }

  private populateIntakeDetails() {
    const meals: IMeal[] = this.intake.meals;
    if (meals) {
      meals.forEach(
        (meal: IMeal) => {
          const mealFoods: IMealFood[] = meal.mealFoods;
          if (mealFoods) {
            mealFoods.forEach(
              (mealFood: IMealFood) => {
                const f = this.intakesService.populateIntakeDetails(this.intake);
                if (f) {
                  this.fats = f.fats;
                  this.saturates = f.saturates
                  this.carbohydrates = f.carbohydrates;
                  this.sugars = f.sugars
                }
              }
            );
          }
        }
      );
    }
  }

  viewIntakeDetails(intake: IIntake): void {
    const intakeId: string = intake.id;
    log('intake-card.ts', this.viewIntakeDetails.name, `Attempting to access intake with id: '${intakeId}'`);
    if (this.isAuthenticated) {
      const url: string = `/history/${intakeId}`;
      this.router
        .navigate([url])
        .catch(
          (error) => {
            log('intake-card.ts', this.viewIntakeDetails.name, `Could not navigate to: ${url}, error:`, error);
          }
        );
    } else {
      log('intake-card.ts', this.viewIntakeDetails.name, 'User is not authenticated!');
    }
  }

  deleteIntake(intake: IIntake): void {
    log('intake-card.ts', this.deleteIntake.name, `Attempting to delete intake with id: '${intake.id}'`);
    if (this.isAuthenticated) {
      this.intakesService
        .deleteIntake(intake)
        .subscribe(
          () => { },
          (error: HttpErrorResponse) => {
            log('intake-card.ts', this.deleteIntake.name, 'Error occurred when deleting intake, error:', error);
            this.errorResponse = error;
          }
        );
      this.reloadPage(this.deleteIntake.name);
    } else {
      log('intake-card.ts', this.deleteIntake.name, 'User is not authenticated!');
    }
  }

  private reloadPage(caller: string): void {
    // reloads the page by navigating silently to 'dashboard/add'
    this.router
      .navigateByUrl(Constants.ADD_MEAL_URL, { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate([Constants.DASHBOARD_URL])
          .catch(
            (error) => {
              log('intake-card.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${Constants.DASHBOARD_URL}`, error);
            }
          );
      })
      .catch(
        (error) => {
          log('intake-card.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${Constants.ADD_MEAL_URL}`, error);
        }
      );
  }

}
