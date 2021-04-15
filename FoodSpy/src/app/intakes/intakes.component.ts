import { Component, OnInit } from '@angular/core';
import { IntakesService } from '../services/intakes.service';
import { Constants } from '../shared/Constants';
import { log } from '../shared/Logger';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { IUser } from '../interfaces/IUser';

@Component({
  selector: 'app-intakes',
  templateUrl: './intakes.component.html',
  styleUrls: ['./intakes.component.scss']
})
export class IntakesComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;
  isLoading: boolean = true;

  user: IUser | null = null;
  isAuthenticated: boolean = false;
  authenticatedUserEmail: string = '';

  currentTime: Date = new Date();

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

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.authenticatedUserEmail = this.userService.authenticatedUserEmail;
      log('intakes.ts', this.ngOnInit.name, 'this.authenticatedUserEmail:', this.authenticatedUserEmail);
    }
    this.intakesService
      .getIntakesByEmail(this.authenticatedUserEmail)
      .subscribe(
        (intakes) => {
          this.intakes = intakes;
          this.isLoading = false;
        },
        (error) => {
          log('intakes.ts', this.ngOnInit.name, '(error) error:', error);
          this.isLoading = false;
        }
      )
    if (!this.isInDebugMode) {  // only slice if not in Debug Mode
      this.intakesColumns = this.intakesColumns.slice(2);
    }
  }

  viewIntakeDetails(intakeId: string): void {
    log('intakes.ts', this.viewIntakeDetails.name, `Attempting to access intake with id: '${intakeId}'`);
    if (this.isAuthenticated) {
      this.router.navigate([`/history/${intakeId}`]);
    } else {
      log('intakes.ts', this.viewIntakeDetails.name, 'User is not authenticated!');
    }
  }

  addNewMeal(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['dashboard/add']);
    } else {
      log('intakes.ts', this.addNewMeal.name, 'User is not authenticated!');
    }
  }

  canShowIntakesTable(): boolean {
    /*
    if (!this.intakes) {
      return false;
    } else if (this.intakes.length === 0) {
      return false;
    } else {
      return false;
    }
    */
    return true;
  }
}
