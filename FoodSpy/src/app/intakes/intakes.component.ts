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

  isInDebugMode: boolean = Constants.isInDebugMode;

  user: IUser | null = null;
  isAuthenticated: boolean = false;
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
    private router: Router,
    private userService: UserService
  ) {
    this.currentDate = this.currentTime.toISOString().split("T")[0];
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.isAuthenticated = this.userService.isAuthenticated;
      this.authenticatedUserEmail = this.userService.authenticatedUserEmail;
      log('intakes.ts', 'constructor()', 'this.authenticatedUserEmail:', this.authenticatedUserEmail);
    }
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

  scanBarcode(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['dashboard/scan']);
    } else {
      log('intakes.ts', this.scanBarcode.name, 'User is not authenticated!');
    }
  }
}
