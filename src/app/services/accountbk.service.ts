import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceBK {
  private acct: string | null = null;
  private cc: string | null = null;
  private encryptedAcctParam: string | null = null;
  private oauth: string | null = null;
  private enableUrlEncryption: boolean = environment.enableUrlEncryption;

  constructor(private encryptionService: EncryptionService, private route: ActivatedRoute, private router: Router) {
    // Subscribe to router events to handle query parameters
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      
      const snapshot = this.route.snapshot;
      this.encryptedAcctParam = snapshot.queryParamMap.get('acct');
      this.oauth              = snapshot.queryParamMap.get('oauth');
      
      // Main condition: Check if URL encryption is enabled and acctParam is present
      if (this.enableUrlEncryption && this.encryptedAcctParam && this.oauth !== 'isDev') {
        this.acct = this.encryptionService.decrypt(this.encryptedAcctParam);
        console.log('Decrypted URL parameter:', this.acct);
        // Check if decryption was successful
        if (!this.acct) {
          console.error('Decryption returned a blank value.');
          this.router.navigate(['unauthorized'], { replaceUrl: true });
          return; // Exit the function to prevent further execution
        }
      }else{
       if(this.oauth && this.oauth === 'isDev' && this.enableUrlEncryption){
          this.acct = this.encryptedAcctParam;
          console.log('OAuth is set and in development mode, using encryptedAcctParam directly:', this.acct);
        }else{
          if (this.encryptedAcctParam && !this.enableUrlEncryption) {
            this.acct = this.encryptedAcctParam;
            console.log('Account URL parameter:', this.acct);
          }else{
            this.acct = this.encryptedAcctParam;
            console.log('Else Account URL parameter:', this.acct);
          }
        }
        if (snapshot.queryParamMap.has('cc')) {
          this.cc = snapshot.queryParamMap.get('cc');
        }else{
          this.cc = 'USF';
        }
      }
      //this.cc = snapshot.queryParamMap.get('cc');
    }); 
  }

  public getAccount(): string | null {
    return this.acct;
  }
  public getCc(): string | null {
    return this.cc;
  }

}