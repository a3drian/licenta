import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
// Interfaces:
import { IIntake } from 'foodspy-shared';
import { Intake } from '../models/Intake';
import { IUser } from 'foodspy-shared';
// Services:
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

  user: IUser | null = null;
  userEmail: string = '';

  constructor(
    private intakesService: IntakesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        log('intake-history.ts', 'constructor()', 'params:', params);
        this.intakeId = params.id ? params.id : '0';
      }
    );

    if (this.intakeId === '0') {
      log('intake-history.ts', 'constructor()', 'this.intakeId === 0');
    } else {
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
    }
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.userEmail = this.userService.authenticatedUserEmail;
      log('intake-history.ts', this.ngOnInit.name, 'this.userEmail:', this.userEmail);
    }
    this.intakesService
      .getIntakeById(this.intakeId)
      .subscribe(
        (data) => {
          this.intake = new Intake(data);
          this.intakeWasFound = this.intake ? true : false;
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          log('intake-history.ts', this.ngOnInit.name, 'error:', error);
          this.errorResponse = error;
        }
      );
  }

}
