import { Component, OnInit } from '@angular/core';
import { Constants } from '../shared/Constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  constructor() { }

  ngOnInit(): void {
  }

}
