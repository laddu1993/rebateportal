import { Component,Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deleteitem',
  templateUrl: './deleteitem.component.html',
  styleUrls: ['./deleteitem.component.scss']
})
export class DeleteitemComponent {
  assetUrl = environment.assetUrl;
  @Output() deletedItemId = new EventEmitter<{itemDesc: string}>();

  itemDesc: string = '';
  constructor(public dialogRef: DialogRef, 
    @Inject(MAT_DIALOG_DATA) public data: any
 ) { }
  ngOnInit(){
    console.log(this.data)
    this.itemDesc = this.data.itemDesc;
    
  }
  deleteRebateItemData(){
    this.deletedItemId.emit({ itemDesc: this.itemDesc});
    this.dialogRef.close();    
  }
  closeDialogPopUp(){
    this.dialogRef.close();
  }
}
