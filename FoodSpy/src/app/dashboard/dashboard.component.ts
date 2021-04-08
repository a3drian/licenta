import { Component, OnDestroy, OnInit } from '@angular/core';
import { IIntake } from '../interfaces/IIntake';
import { IntakesService } from '../services/intakes.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Constants } from '../shared/Constants';

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
    private authService: AuthService
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

  viewIntakeDetails(intake: IIntake) {

  }

}
