import { Component, OnInit } from '@angular/core';
import { IntakesService } from '../services/intakes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IIntake } from 'foodspy-shared';
import { Intake } from '../models/Intake';
import { Constants } from '../shared/Constants';
import { UserService } from '../auth/user.service';
import { IUser } from 'foodspy-shared';
import { log } from '../shared/Logger';
import { STATUS_CODES } from 'foodspy-shared';

@Component({
  selector: 'app-intake-history',
  templateUrl: './intake-history.component.html',
  styleUrls: ['./intake-history.component.scss']
})
export class IntakeHistoryComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  intake: IIntake = <IIntake>{};
  intakeId: string = '';
  intakeWasFound: boolean = false;
  idNotFound: boolean = false;
  isLoading: boolean = true;

  user: IUser | null = null;
  authenticatedUserEmail: string = '';

  constructor(
    private intakesService: IntakesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.activatedRoute.params.subscribe(
      (params) => {
        log('intake-history.ts', 'constructor()', 'params:', params);
        this.intakeId = params.id ? params.id : '0';
      }
    );

    if (this.intakeId === '0') {
    } else {
      this.intakesService
        .getIntakeById(this.intakeId)
        .subscribe(
          (data) => {
            log('intake-history.ts', 'constructor()', '(data), data:', data);
            this.idNotFound = false;
            log('intake-history.ts', 'constructor()', '(data), this.idNotFound:', this.idNotFound);
          },
          (error) => {
            log('intake-history.ts', 'constructor()', '(error), error:', error);
            if (error.status === STATUS_CODES.NOT_FOUND) {
              this.idNotFound = true;
            }
            log('intake-history.ts', 'constructor()', '(error) this.idNotFound:', this.idNotFound);
          }
        );
    }
  }

  ngOnInit(): void {
    this.user = this.userService.user;
    if (this.user) {
      this.authenticatedUserEmail = this.userService.authenticatedUserEmail;
      log('intake-history.ts', this.ngOnInit.name, 'this.authenticatedUserEmail:', this.authenticatedUserEmail);
    }
    this.intakesService
      .getIntakeById(this.intakeId)
      .subscribe(
        (data) => {
          this.intake = new Intake(data);
          this.intakeWasFound = this.intake ? true : false;
          this.isLoading = false;
        }
      );
  }

}
