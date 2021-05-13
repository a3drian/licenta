import { Component, OnInit } from '@angular/core';
import { Constants } from '../shared/Constants';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  constructor() { }

  ngOnInit(): void { }

}
