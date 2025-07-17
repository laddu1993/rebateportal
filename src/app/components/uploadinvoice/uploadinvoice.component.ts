import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-uploadinvoice',
  templateUrl: './uploadinvoice.component.html',
  styleUrls: ['./uploadinvoice.component.scss']
})
export class UploadinvoiceComponent {
  invoiceFile:any;
  @Output() uploadInvoiceCreated = new EventEmitter<{ invoiceFile: any }>();
  assetUrl = environment.assetUrl;
  fileName: string | null = null;
  errorMessage: string | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes
  
  constructor(private http: HttpClient, public dialogRef: DialogRef,) {}

  onFileSelected(event:any) {   
    const fileInput = event.target as HTMLInputElement;
    const file:File = event.target.files[0];
    if (file) {
      // Check file size
      if (file.size > this.maxFileSize) {
        this.errorMessage = "File size exceeds 2 MB. Please upload a smaller file.";
        this.fileName = null;
        fileInput.value = ''; // Clear the file input
      } else {
        this.invoiceFile = file;  
        this.fileName = file.name;
        this.errorMessage = null; // Clear any previous error message
      }
    }
  }

  onSubmit(){
    if(this.fileName){
      this.uploadInvoiceCreated.emit({ invoiceFile: this.invoiceFile});
      this.dialogRef.close();
    }
  }

  closeDialogPopUp(){
    this.dialogRef.close();
  }

  ClearData(): void {
    this.fileName = null; // Clear the file name
    const fileInput = document.querySelector<HTMLInputElement>('.file-input');
    if (fileInput) {
      fileInput.value = ''; // Clear the file input element
    }
  }

}
