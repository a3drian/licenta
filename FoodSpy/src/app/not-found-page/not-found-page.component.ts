import { Component, OnInit } from '@angular/core';
// Shared:
import { Constants } from '../shared/Constants';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  constructor() { }

  ngOnInit(): void { }

}
