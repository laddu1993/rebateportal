import { Component, EventEmitter, Output, ElementRef, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addnotes',
  templateUrl: './addnotes.component.html',
  styleUrls: ['./addnotes.component.scss']
})
export class AddnotesComponent {
  notes:any;
  @Output() notesCreated = new EventEmitter<{ notes: any }>();
  constructor(public dialogRef: DialogRef, private elementRef: ElementRef, @Inject(MAT_DIALOG_DATA) public data: any){}
  ngOnInit(): void {
    this.notes = this.data.notes;
  }
  closeDialogPopUp(){
    this.dialogRef.close();
  }
  clearField(){
    this.elementRef.nativeElement.querySelector('#notes').value = '';
  }
  addNotes(){
    this.notes = this.elementRef.nativeElement.querySelector('#notes').value;
    console.log("Notes:" + this.notes)
    this.notesCreated.emit({ notes: this.notes });
    this.dialogRef.close();
  }
}
