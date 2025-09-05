import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rebateID = new BehaviorSubject<string>('');
  private rebateStatus = new BehaviorSubject<string>('NotCurrentlyEnrolled');
  private companyName = new BehaviorSubject<string>('');
  private customerID = new BehaviorSubject<string>('');
  private childID = new BehaviorSubject<string>('');
  private rebateType = new BehaviorSubject<string>('');
  private fleetID = new BehaviorSubject<string>('');
  private expiration = new BehaviorSubject<string>('');
  private earnedDiscount = new BehaviorSubject<string>('');
  private customerName = new BehaviorSubject<string>('');

  private rebateFilter = new BehaviorSubject<string>('inprogress');
  private rebateFilterType = new BehaviorSubject<string>('');
  private rebateFilterSearch = new BehaviorSubject<string>('');

  dataRebateID$ = this.rebateID.asObservable();
  dataRebateStatus$ = this.rebateStatus.asObservable();
  datacompanyName$ = this.companyName.asObservable();
  datacustomerID$ = this.customerID.asObservable();
  datachildID$ = this.childID.asObservable();
  datarebateType$ = this.rebateType.asObservable();
  datafleetID$ = this.fleetID.asObservable();
  dataexpiration$ = this.expiration.asObservable();
  dataearnedDiscount$ = this.earnedDiscount.asObservable();
  datacustomerName$ = this.customerName.asObservable();

  dataRebateFilter$ = this.rebateFilter.asObservable();
  dataRebateFilterType$ = this.rebateFilterType.asObservable();
  dataRebateFilterSearch$ = this.rebateFilterSearch.asObservable();

  setData(rID: string, rStatus: string, company_name: string, customerID: string, childID: string, rebateType: string, fleetID: string, expiration: string, earnedDiscount: string, customerName: string): void {
    this.rebateID.next(rID);
    this.rebateStatus.next(rStatus);
    this.companyName.next(company_name);
    this.customerID.next(customerID);
    this.childID.next(childID);
    this.rebateType.next(rebateType);   
    this.fleetID.next(fleetID);  
    this.expiration.next(expiration);   
    this.earnedDiscount.next(earnedDiscount); 
    this.customerName.next(customerName);  
  }
  /*setSearchData(rFilter: string, rType: string, rSearchText: string){
    this.rebateFilter.next(rFilter);
    this.rebateFilterType.next(rType);
    this.rebateFilterSearch.next(rSearchText);
  }*/
  setSearchTerm(rFilter: string){
    this.rebateFilter.next(rFilter);
  }
  setSearchType(rType: string){
    this.rebateFilterType.next(rType);
  }
  setsearchKeyword(rSearchText: string){
    this.rebateFilterSearch.next(rSearchText);
  }
}
