import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ParamMap } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private acct: string | null = null;
  private cc: string | null = null;
  private encryptedAcctParam: string | null = null;
  private oauth: string | null = null;
  private enableUrlEncryption: boolean = environment.enableUrlEncryption;
  private parentId: number | null = null;
  private branchID: string | null = null;
  private flagtype: string | null = null;
  private NP_CustomerID: string | null = null;

  constructor(
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const snapshot = this.route.snapshot;
      this.encryptedAcctParam = snapshot.queryParamMap.get('acct');
      this.oauth = snapshot.queryParamMap.get('oauth');
      
      this.handleDecryptionLogic();
      
      this.cc = snapshot.queryParamMap.get('cc') || 'USF';
    });
  }
  
  private handleDecryptionLogic(): void {
    if (this.enableUrlEncryption && this.encryptedAcctParam && this.oauth !== 'isDev') {
      console.log('Encrypted Test Value: ', decodeURIComponent(this.encryptedAcctParam));
      this.encryptedAcctParam = encodeURIComponent(this.encryptedAcctParam).replace(/%20/g, '%2B');
      this.acct = this.encryptionService.decrypt(decodeURIComponent(this.encryptedAcctParam));
      console.log('Decrypted Test Value: ', this.acct);
      if (!this.acct) {
        console.error('Decryption returned a blank value. Redirecting to unauthorized page.');
        this.router.navigate(['unauthorized'], { replaceUrl: true });
      }
    } else {
      console.log('Original Account Value: ', this.encryptedAcctParam);
      console.log('Encrypted Account Value: ', this.encryptionService.encrypt(this.encryptedAcctParam || ''));
      this.acct = this.oauth === 'isDev' && this.enableUrlEncryption
        ? this.encryptedAcctParam
        : this.encryptedAcctParam;
    }
  }

  public getAccount(): string | null {
    return this.acct;
  }
  
  public getCc(): string | null {
    return this.cc;
  }

  // Setters
  setParentId(parentId: number): void {
    this.parentId = parentId ?? null; // Set to null if undefined
  }

  setBranchId(branchID: string): void {
    this.branchID = branchID ?? null; // Set to null if undefined
  }

  setNP_CustomerID(NP_CustomerID: string): void {
    this.NP_CustomerID = NP_CustomerID ?? null; // Set to null if undefined
  }

  setFlagType(flagtype: string): void {
    this.flagtype = flagtype ?? null; // Set to null if undefined
  }

  // Getters
  getParentId(): number | null {
    return this.parentId;
  }

  getBranchId(): string | null {
    return this.branchID;
  }

  getNP_CustomerID(): string | null {
    return this.NP_CustomerID;
  }

  geFlagType(): string | null {
    return this.flagtype;
  }

}