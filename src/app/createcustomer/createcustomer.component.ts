import { Component,Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-createcustomer',
  templateUrl: './createcustomer.component.html',
  styleUrls: ['./createcustomer.component.scss']
})
export class CreatecustomerComponent {
  assetUrl = environment.assetUrl;
  message: string = '';
  headerMessage: string = '';
  constructor(public dialogRef: DialogRef, 
    @Inject(MAT_DIALOG_DATA) public data: any
 ) { }
  ngOnInit(){
    this.message = this.data.messageData;
    this.headerMessage = this.data.headerMessage;
    
  }
  
  closeDialogPopUp(){
    this.dialogRef.close();
  }
}
