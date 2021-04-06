import { Component, OnDestroy, OnInit } from '@angular/core';
import { IIntake } from '../interfaces/IIntake';
import { IntakesService } from '../services/intakes.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean = false;
  private userSubscription: Subscription = new Subscription;

  currentTime: Date = new Date();
  currentDate: string;
  authenticatedUserEmail: string | undefined = '';

  isInDebugMode: boolean = true;

  USER_EMAIL = 'add-intake@email.com';

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
            this.USER_EMAIL = this.authenticatedUserEmail;
          }
        }
      );
    this.intakesService
      .getIntakesByEmail(this.USER_EMAIL)
      .subscribe(
        (meals) => {
          this.intakes = meals;
        }
      )
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.intakesColumns = this.intakesColumns.slice(2);
    }
    console.log(`constructor(): ${this.authenticatedUserEmail}`);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onLogout(): void {
    this.isAuthenticated = false;
    this.authService.logout();
  }

}
