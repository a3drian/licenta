import { Component, Input, OnInit } from '@angular/core';
// Shared:
import { Constants } from 'src/app/shared/Constants';

@Component({
  selector: 'app-add-intake-card',
  templateUrl: './add-intake-card.component.html',
  styleUrls: ['./add-intake-card.component.scss']
})
export class AddIntakeCardComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public hasConsumed!: boolean;

  today: Date = new Date();

  constructor() { }

  ngOnInit(): void { }

}
