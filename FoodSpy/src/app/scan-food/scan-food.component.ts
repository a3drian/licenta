import { Component, OnInit } from '@angular/core';
import { Constants } from '../shared/Constants';

@Component({
  selector: 'app-scan-food',
  templateUrl: './scan-food.component.html',
  styleUrls: ['./scan-food.component.scss']
})
export class ScanFoodComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  constructor() { }

  ngOnInit(): void { }

}
