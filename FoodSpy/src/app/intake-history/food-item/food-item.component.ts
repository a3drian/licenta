import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../shared/Constants';
import { IFood } from '../../interfaces/IFood';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {

  isInDebugMode: boolean = Constants.isInDebugMode;

  @Input()
  public food!: IFood;

  constructor() { }

  ngOnInit(): void { }

}
