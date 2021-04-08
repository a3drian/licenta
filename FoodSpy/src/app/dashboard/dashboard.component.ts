import { Component, OnDestroy, OnInit } from '@angular/core';
import { IntakesService } from '../services/intakes.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isInDebugMode: boolean = Constants.isInDebugMode;

  isAuthenticated: boolean = false;
  private userSubscription: Subscription = new Subscription;
  authenticatedUserEmail: string = '';

  currentTime: Date = new Date();
  currentDate: string;

  intakes: any;
  intakesColumns: string[] = [
    'id',
    'email',
    'foods',
    'createdAt',
    'details'
  ];

  constructor(
    private intakesService: IntakesService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {
    this.currentDate = this.currentTime.toISOString().split("T")[0];
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user
      .subscribe(
        (user) => {
          // the opposite of not having an user authenticated, eg. false => !false = true
          if (user) {
            this.isAuthenticated = true;
            this.authenticatedUserEmail = user.email;
            this.userService.user = user;
          }
        }
      );
    this.intakesService
      .getIntakesByEmail(this.authenticatedUserEmail)
      .subscribe(
        (intakes) => {
          this.intakes = intakes;
        }
      )
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.intakesColumns = this.intakesColumns.slice(2);
    }
    console.log(`dashboard.ts.constructor(): ${this.authenticatedUserEmail}`);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onLogout(): void {
    this.isAuthenticated = false;
    this.authService.logout();
  }

  viewIntakeDetails(intakeId: string) {
    log('dashboard.ts', 'viewIntakeDetails()', `Attempting to access intake with id: '${intakeId}'`);
    if (this.isAuthenticated) {
      this.router.navigate([`/history/${intakeId}`]);
    } else {
      log('dashboard.ts', 'viewIntakeDetails()', 'User is not authenticated!');
    }
  }

  addNewMeal() {
    if (this.isAuthenticated) {
      this.router.navigate(['/add']);
    } else {
      log('dashboard.ts', 'addNewMeal()', 'User is not authenticated!');
    }
  }

}
