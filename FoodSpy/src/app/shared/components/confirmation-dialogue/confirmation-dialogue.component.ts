import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
// Shared:
import { Constants } from '../../Constants';

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrls: ['./confirmation-dialogue.component.scss']
})
export class ConfirmationDialogueComponent implements OnInit {

  isInDebugMode: boolean = Constants.IN_DEBUG_MODE;

  @Input()
  public message!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public createdAt: Date,
    public dialogReference: MatDialogRef<ConfirmationDialogueComponent>
  ) { }

  ngOnInit(): void { }

  getConfirmation(confirmation: boolean): void {
    this.dialogReference.close(confirmation);
  }

}
