import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Interfaces:
import { IIntake, IUser } from 'foodspy-shared';
// Services:
import { IntakesService } from 'src/app/services/intakes.service';
import { UserService } from 'src/app/auth/user.service';
// Shared:
import { Constants } from 'src/app/shared/Constants';
import { log } from 'src/app/shared/Logger';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-intake-card',
  templateUrl: './intake-card.component.html',
  styleUrls: ['./intake-card.component.scss']
})
export class IntakeCardComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;

  @Input()
  public intake!: IIntake;
  @Input()
  public intakes!: IIntake[];

  user: IUser | null = null;
  isAuthenticated: boolean = false;
  userEmail: string = '';
  userTargetCalories: number = 0;

  errorResponse: HttpErrorResponse | null = null;

  constructor(
    private intakesService: IntakesService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.userEmail = this.userService.authenticatedUserEmail;
      this.userTargetCalories = this.userService.authenticatedUserTargetCalories;
      log('intakes.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }
  }

  getPercentage(intake: IIntake): number {
    const y = this.userTargetCalories;
    const x = intake.calories;
    const calories = y / x;
    return calories * 100;
  }

  viewIntakeDetails(intake: IIntake): void {
    const intakeId: string = intake.id;
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

  private reloadPage(caller: string): void {
    // reloads the page by navigating silently to 'dashboard/add'
    this.router
      .navigateByUrl(Constants.ADD_MEAL_URL, { skipLocationChange: true })
      .then(() => {
        this.router
          .navigate([Constants.DASHBOARD_URL])
          .catch(
            (error) => {
              log('intakes.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${Constants.DASHBOARD_URL}`, error);
            }
          );
      })
      .catch(
        (error) => {
          log('intakes.ts', this.reloadPage.name, `Called from '${caller}'. Could not navigate to: ${Constants.ADD_MEAL_URL}`, error);
        }
      );
  }

}
