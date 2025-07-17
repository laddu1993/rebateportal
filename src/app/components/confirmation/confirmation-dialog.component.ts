import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
    assetUrl = environment.assetUrl;
    constructor(public dialogRef: DialogRef) { }

    closePopup(){
        this.dialogRef.close();
    }
}