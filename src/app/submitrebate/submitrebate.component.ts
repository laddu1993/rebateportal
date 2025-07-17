import { Component,Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submitrebate',
  templateUrl: './submitrebate.component.html',
  styleUrls: ['./submitrebate.component.scss']
})

export class SubmitrebateComponent {
  assetUrl = environment.assetUrl;
  message: string = '';
  headerData: string = '';
  isSubmit: string = '';
  enableUrlEncryption: boolean = environment.enableUrlEncryption;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public dialogRef: DialogRef, 
    @Inject(MAT_DIALOG_DATA) public data: any
 ) { }
  ngOnInit(){
    this.message = this.data.messageData;
    this.headerData = this.data.headerData;
    this.isSubmit = this.data.isSubmit;
    
  }
  
  closeDialogPopUp(){
    this.dialogRef.close();
    if(this.isSubmit == '1'){
      this.router.navigate(['/']);
    }else if(this.isSubmit == '2'){
      this.router.navigate(['unauthorized']);
    }
  }

  noClick(){
    this.dialogRef.close();
  }

  yesClick() {
    // Close the dialog
    this.dialogRef.close();
    this.activatedRoute.queryParams.subscribe(params => {
      let acctParam = params['acct']; 
      let oauth = this.activatedRoute.snapshot.queryParamMap.get('oauth');
      if (this.enableUrlEncryption && oauth !== 'isDev') {
        acctParam = params['acct'];
      }
      const queryParams: any = { acct: acctParam };
      if (oauth) {
        queryParams.oauth = oauth; // Add oauth to queryParams if present
      }
      this.router.navigate(['/myrebates'], {
        queryParams: queryParams,
      });
    });
  }  

}
