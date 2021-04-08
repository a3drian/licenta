import { Component, OnInit } from '@angular/core';
import { IntakesService } from '../services/intakes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IIntake } from '../interfaces/IIntake';
import { Intake } from '../models/Intake';
import { Constants } from '../shared/Constants';
import { UserService } from '../auth/user.service';
import { IUser } from '../interfaces/IUser';
import { log } from '../shared/Logger';

@Component({
  selector: 'app-intake-history',
  templateUrl: './intake-history.component.html',
  styleUrls: ['./intake-history.component.scss']
})
export class IntakeHistoryComponent implements OnInit {

  isInDebugMode: boolean = Constants.isInDebugMode;

  intake: IIntake = <IIntake>{};
  intakeId: string = '';
  intakeWasFound: boolean = false;
  idNotFound: boolean = false;

  user: IUser;

  constructor(
    private intakesService: IntakesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.user = this.userService.user;
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
            if (error.status === 404) {
              this.idNotFound = true;
            }
            log('intake-history.ts', 'constructor()', '(error) this.idNotFound:', this.idNotFound);
          }
        );
    }
  }

  ngOnInit(): void {
    this.intakesService
      .getIntakeById(this.intakeId)
      .subscribe(
        (data) => {
          this.intake = new Intake(data);
          this.intakeWasFound = this.intake ? true : false;
        }
      );
  }

}
