import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
// Shared:
import { Constants } from '../Constants';

@Component({
  selector: 'app-error-response',
  templateUrl: './error-response.component.html',
  styleUrls: ['./error-response.component.scss']
})
export class ErrorResponseComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  errorMessage: string = '';

  @Input()
  public errorResponse!: HttpErrorResponse;

  constructor() { }

  ngOnInit(): void {
    this.errorMessage = `An error occured! ${this.errorResponse.status} ${this.errorResponse.statusText}. Please try again later...`;
  }

}
