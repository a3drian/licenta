import { Component, Input, OnInit } from '@angular/core';
// Interfaces:
import { IIntake } from 'foodspy-shared';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-intakes-list',
  templateUrl: './intakes-list.component.html',
  styleUrls: ['./intakes-list.component.scss']
})
export class IntakesListComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  intakes!: IIntake[];

  constructor() { }

  ngOnInit(): void { }

}
