import { Component, Input, OnInit } from '@angular/core';
// Interfaces:
import { IFood } from 'foodspy-shared';
// Shared:
import { Constants } from '../../shared/Constants';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public food!: IFood;

  constructor() { }

  ngOnInit(): void { }

}
