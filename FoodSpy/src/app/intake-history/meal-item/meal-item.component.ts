import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../shared/Constants';
import { IMeal } from '../../interfaces/IMeal';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.scss']
})
export class MealItemComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public meal!: IMeal;

  constructor() { }

  ngOnInit(): void { }

}
