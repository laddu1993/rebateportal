import { Component,Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-deleterebate',
  templateUrl: './deleterebate.component.html',
  styleUrls: ['./deleterebate.component.scss']
})
export class DeleterebateComponent {
  @Output() deletedRebateId = new EventEmitter<{rebateId: string}>();

  customerName: string = '';
  rebateId: string = '';
  rebateStatus: string = '';
  statusStyleClass: string ='';
  constructor(public dialogRef: DialogRef, 
    @Inject(MAT_DIALOG_DATA) public data: any
 ) { }
  ngOnInit(){
    console.log(this.data)
    switch(this.data.rebateStatus){
      case 'Draft': this.statusStyleClass = 'draft';break;
      case 'Waiting': this.statusStyleClass = 'waiting';break;
      case 'Submitted': this.statusStyleClass = 'submitted';break;
    }
    this.customerName = this.data.customerName;
    this.rebateId = this.data.rebateId;
    this.rebateStatus = this.data.rebateStatus;
  }
  deleteRebateData(){
    this.deletedRebateId.emit({ rebateId: this.rebateId});
    this.dialogRef.close();    
  }
  closeDialogPopUp(){
    this.dialogRef.close();
  }
}
