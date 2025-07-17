import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { AdditemComponent } from '../additem/additem.component';
import { MatDialog } from '@angular/material/dialog';
import { AddnotesComponent } from '../addnotes/addnotes.component';
import { UploadinvoiceComponent } from '../uploadinvoice/uploadinvoice.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RebateService } from './rebate.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeleteitemComponent } from '../deleteitem/deleteitem.component';
import { SubmitrebateComponent } from 'src/app/submitrebate/submitrebate.component';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { LoaderService } from 'src/app/services/loader.service';
import { DataService } from 'src/app/services/data.service';
import { RefreshTrackerService } from 'src/app/services/refresh-tracker.service';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { invoice } from '@igniteui/material-icons-extended';
import { DeviceService } from 'src/app/services/device.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionService } from 'src/app/services/encryption.service';

export interface RebateItem {
  ID: number,
  points: number;
  description: string;
  retail: number;
  cost: number;
  discount: string;
  offer: number;
  rebate: any;
  serial: string,
  sku: string,
  invoice_number: string,
  pg?: string,
}

@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.scss']
})

export class RebateComponent implements OnInit {
  displayedColumns: string[] = ['description', 'points', 'retail', 'cost', 'discount', 'offer', 'rebate', 'action'];
  NATdisplayedColumns: string[] = ['description', 'retail', 'cost', 'discount', 'offer', 'rebate', 'action'];
  dataSource: any;
  username: string = 'vinil@speridian.com';
  password: string = 'IUKhJMNPHGmYmOOBHC4MjQ==';
  messages: string[] = [];
  token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJJc3N1ZXIgb2YgdGhlIEpXVCIsImF1ZCI6IkF1ZGllbmNlIHRoYXQgdGhlIEpXVCIsInN1YiI6IlN1YmplY3Qgb2YgdGhlIEpXVCIsImlhdCI6MTcxNzU3NjMyMSwiZXhwIjoxNzE3NTc5OTIxLCJlbWFpbCI6ImdlZXRodW1vbC5nb3BpQHNwZXJpZGlhbi5jb20ifQ.70d5iZ-GXu1N3XnGFdQc86Wc5tMkmdandjbynUkwOCs";
  rebateItemList !: RebateItem[];
  jsonData: any;
  rebateType: string = '';
  fleetID: string = '';
  currentRebateID: string = '';
  FleetIdRowId: string = '';
  customerName: string = '';
  customerID: string = '';
  totalRebate: any;
  totalPoints: any;
  referenceNo: string = '';
  fileName: string = '';
  rebateSatus: string = '';
  statusStyleClass: string = '';
  isVisible: boolean = false;
  isVisibleSubmit: boolean = false;
  deleteItemIds: string = '';
  notes: any;
  account: any;
  cc: any;
  dataRebateID: string = '';
  dataRebateStatus: string = '';
  datacompanyName: string = '';
  datacustomerID: string = '';
  datachildID: string = '';
  datarebateType: string = '';
  datafleetID: string = '';
  dataexpiration: string = '';
  dataearnedDiscount: string = '';
  //isLoading = true; // Loader state
  isReadOnly = true;
  itemExists = false;
  searchText = '';
  expiration: string = '';
  earnedDiscount: string = '';
  BranchId: string = '';
  NP_CustomerID: string = '';
  showTotalPointsDiv: boolean = true; // This is the condition
  isExpired: number = 1;
  isProSawItemContain: boolean = false;
  proSawArray: string[] = [];
  allowedRoles: string[] = ['Bid Assist', 'Military/First Responder'];
  isRebateModified: boolean = false;
  rebateItemCount: number = 0;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  assetUrl = environment.assetUrl;
  isLoadingPopup: boolean = true;
  envName = environment.name;
  isUATMode: boolean = environment.production;
  enableUrlEncryption: boolean = environment.enableUrlEncryption;
  isSaving = false;
  currentPage: number = 0; // Tracks the current page index
  pageSize: number = 10;  // Matches the pageSize set in the paginator

  constructor(private encryptionService: EncryptionService, private snackBar: MatSnackBar, private refreshTracker: RefreshTrackerService, private deviceService: DeviceService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private dataService: DataService, private loaderService: LoaderService, private acctService: AccountService, private http: HttpClient, private service: RebateService, private dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private elementRef: ElementRef, private renderer: Renderer2) {
    this.getProSawSkus();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  OpenAdditem(): void {
    const dialogRef = this.dialog.open(AdditemComponent, { disableClose: true, maxWidth: '90vw' });
  
    dialogRef.componentInstance.rebateItemCreated.subscribe((data: any) => {
      if (!data.serial) {
        data.serial = `no-serial-${data.invoice}-${new Date().getTime()}`;
      }
  
      const formData = new FormData();
      formData.append('account', this.account);
      formData.append('cc', this.cc);
      formData.append('sku', data.sku);
      formData.append('serial', data.serial);
      formData.append('invoice', data.invoice);
      formData.append('price', data.price);
      formData.append('rebateType', this.rebateType);
      formData.append('expiration', this.expiration);
      formData.append('earned_discount', this.earnedDiscount);
      formData.append('flagType', this.acctService.geFlagType() || '');
  
      this.service.addRebateItem(formData).subscribe(res => {
        this.jsonData = res;
  
        if (!this.jsonData.status) {
          this.snackBar.open(this.jsonData.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
          return; // Prevent closing the popup
        }
  
        const newItem = {
          ID: 0,
          points: this.jsonData.result.points,
          description: this.jsonData.result.desc,
          retail: this.jsonData.result.price,
          cost: this.jsonData.result.cost,
          discount: this.jsonData.result.discount,
          offer: this.jsonData.result.offer,
          rebate: this.jsonData.result.rebate,
          sku: this.jsonData.result.sku,
          serial: data.serial,
          invoice_number: data.invoice,
          pg: this.jsonData.result.pg
        };
  
        const itemExists = this.rebateItemList.some(item => item.serial === this.jsonData.result.serial);
  
        if (itemExists) {
          this.snackBar.open('Item with the same serial number already added.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['red-snackbar']
          });
          return;
        }
  
        this.isRebateModified = true;
        this.rebateItemList.unshift(newItem);
        this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
        this.totalPoints = this.getTotalPoints();
        this.totalRebate = this.getTotalCost();
        this.rebateItemCount = this.rebateItemList.length;
  
        if (this.rebateType === 'Fleet') {
          this.RecalculateRebate();
        }
  
        this.snackBar.open(`SKU ${this.jsonData.result.sku} Added Successfully!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });

        // **Close popup only if status is true**
        if (this.jsonData.status) {
          dialogRef.close();
        }

      });
    });
  }  

  private RecalculateRebate(): void {
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('rebateType', this.rebateType);
    formData.append('expiration', this.expiration);
    formData.append('earned_discount', this.earnedDiscount);
    formData.append('rebateItemList', JSON.stringify(this.rebateItemList));

    this.service.calculateRebateItem(formData).subscribe(res => {
      this.jsonData = res;
      this.rebateItemList = this.jsonData.result.rebate_item_list_recalculated;
      this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
      this.totalPoints = this.getTotalPoints();
      this.totalRebate = this.getTotalCost();
    });
  }

  OpenAddnotes(): void {
    const dialogRef = this.dialog.open(AddnotesComponent, { data: { notes: this.notes } });
    dialogRef.componentInstance.notesCreated.subscribe((data: any) => {
      this.notes = data.notes;
      this.updateRebate('0');
      //console.log("Notes:" + this.notes)
    });
  }
  
  OpenUploadinv(): void {
    const dialogRef = this.dialog.open(UploadinvoiceComponent); 
    dialogRef.componentInstance.uploadInvoiceCreated.subscribe((data: any) => {
      const file: File = data.invoiceFile;
      this.fileName = file.name;
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("aa_iid", this.referenceNo);
  
      // Call the service method to upload the invoice
      this.service.uploadInvoice(formData).subscribe({
        next: (res) => {
          // Handle successful upload
          const referenceNumber = this.referenceNo ? this.referenceNo : 'N/A';
          const messageData = 'Rebate Submitted: Reference Number: ' + referenceNumber;
          this.snackBar.open(messageData, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
          this.rebateSatus = 'Submitted';
          this.statusStyleClass = 'submitted';
          this.isVisible = true;
          this.isVisibleSubmit = true;
        },
        error: (err) => {
          // Handle error scenarios based on status codes
          let errorMessage = 'An error occurred. Please try again.';
          if (err.status === 400 || err.status === 302) {
            errorMessage = 'File is larger than 2MB. Please upload a file smaller than 2MB.';
          }
  
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['red-snackbar'] // You can define this class in your CSS
          });
        }
      });
    });
  }  

  calculateRebate(event: any, retail: any, rowid: number, element: any) {
    // Default blank input to zero
    let discount = event.target.value.trim() === "" ? 0 : parseFloat(event.target.value);
    //console.log('Event element: ', element);

    // Cap discount to a maximum of 25%
    if (discount > 25) {
      discount = 25;
    }

    // Update the input value to reflect the adjusted discount
    event.target.value = discount;

    let discount_percentage = discount / 100;

    // Determine the maximum allowed percentage based on product group
    let max_percentage = element.pg == 'RPZ_P' ? 0.25 : 0.2;

    // Cap the discount percentage
    discount_percentage = Math.min(discount_percentage, max_percentage);

    // Calculate rebate and offer values
    let rebate = (discount_percentage * 0.5 * retail).toFixed(2);
    let offer = discount_percentage * retail;
    let new_offer = (retail - offer).toFixed(2);

    // Update the current element
    element.discount = discount;
    element.rebate = rebate;
    element.offer = parseFloat(new_offer);

    // Update rebateItemList only if ID and serial match
    const matchingItemIndex = this.rebateItemList.findIndex(
      (item: any) => item.ID === element.ID && item.serial === element.serial
    );

    if (matchingItemIndex !== -1) {
      // Update the matching item
      this.rebateItemList[matchingItemIndex] = element;
    } else {
      // Add new entry if no match found
      this.rebateItemList.push(element);
    }

    // Remove duplicates by ID and serial
    this.rebateItemList = this.rebateItemList.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
        (t) => t.ID === item.ID && t.serial === item.serial
      )
    );

    //console.log('Matching Item Index:', matchingItemIndex);
    //console.log('Updated Rebate Item List:', this.rebateItemList);

    // Update the table
    this.isRebateModified     = true;
    this.dataSource           = new MatTableDataSource<RebateItem>(this.rebateItemList);
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort      = this.sort;

    // Recalculate totals
    this.totalPoints          = this.getTotalPoints();
    this.totalRebate          = this.getTotalCost();
  }

  private compare(a: Date, b: Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private statusSettings(status: string) {
    switch (status) {
      case 'NotCurrentlyEnrolled': this.statusStyleClass = 'draft'; this.isVisible = false; this.isVisibleSubmit = false; break;
      case 'Draft': this.statusStyleClass = 'draft'; this.isVisible = false; this.isVisibleSubmit = false; break;
      case 'Waiting': this.statusStyleClass = 'waiting'; this.isVisible = true; this.isVisibleSubmit = false; break;
      case 'Submitted': this.statusStyleClass = 'submitted'; this.isVisible = true; this.isVisibleSubmit = true; break;
      default: this.statusStyleClass = 'draft'; this.isVisible = false; this.isVisibleSubmit = false; break;

    }
  }
  
  ngOnInit() {
    /*if (this.refreshTracker.hasRefreshed()) {
      console.log('Page was refreshed!');
      this.refreshTracker.reset(); // Reset after checking
    } else {
      console.log('Page loaded normally.');
    }*/
    //this.isLoading = true;
    setTimeout(() => {
      this.isLoadingPopup = false;  // Set to false when data is ready
    }, 2000);  // Simulate a delay, replace with actual data loading logic
    this.loaderService.show();
    this.dataService.dataRebateID$.subscribe(data => {
      this.dataRebateID = data;
    });
    this.dataService.dataRebateStatus$.subscribe(data => {
      this.dataRebateStatus = data;
    });
    this.dataService.datacompanyName$.subscribe(data => {
      this.datacompanyName = data;
    });
    this.dataService.datacustomerID$.subscribe(data => {
      this.datacustomerID = data;
    });
    this.dataService.datachildID$.subscribe(data => {
      this.datachildID = data;
    });
    this.dataService.datarebateType$.subscribe(data => {
      this.datarebateType = data;
    });
    this.dataService.datafleetID$.subscribe(data => {
      this.datafleetID = data;
    });
    this.dataService.dataexpiration$.subscribe(data => {
      this.dataexpiration = data;
    });
    this.dataService.dataearnedDiscount$.subscribe(data => {
      this.dataearnedDiscount = data;
    });
    this.account = this.acctService.getAccount();
    this.cc = 'USF';
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['rid']) {
        this.dataRebateID = params['rid'];
      }
    });
    const rebate_id = this.dataRebateID;
    this.statusSettings(this.dataRebateStatus);
    /*switch (this.dataRebateStatus) {
      case 'NotCurrentlyEnrolled': this.statusStyleClass = 'draft'; this.isVisible = false; break;
      case 'Draft': this.statusStyleClass = 'draft'; this.isVisible = false; break;
      case 'Waiting': this.statusStyleClass = 'waiting'; this.isVisible = true; break;
      case 'Submitted': this.statusStyleClass = 'submitted'; this.isVisible = true; break;
      default: this.statusStyleClass = 'draft'; this.isVisible = false; break;

    }*/
    //console.log("this.dataRebateID" + this.dataRebateID)
    if (this.dataRebateID == '') {
      this.router.navigate(['/myrebates'], {
        //relativeTo: this.activatedRoute,
        queryParams: { acct: this.account },
      });

    }
    const currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy HH:mm:ss')!;
    if (this.dataRebateID == '0') {

      this.totalPoints = 0;
      this.totalRebate = 0;
      this.rebateSatus = this.dataRebateStatus;
      this.customerName = this.datacompanyName;
      this.customerID = this.datacustomerID;
      this.rebateType = this.datarebateType;
      this.fleetID = this.datafleetID;
      this.expiration = this.dataexpiration;
      this.earnedDiscount = this.dataearnedDiscount;
      this.rebateItemList = [];
      this.notes = '';
      this.isExpired = this.compare(new Date(this.expiration), new Date(currentDate), false);
      if (this.earnedDiscount == 'Not Set') {
        this.isExpired = 1;
      }
      //console.log("this.fleetID" + this.fleetID);
      this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
      this.loaderService.hide();
    } else {
      const formData = new FormData();

      formData.append('account', this.account);
      formData.append('cc', this.cc);
      formData.append('rebate_id', rebate_id);

      this.service.getRebateItemList(formData).subscribe(res => {
        //this.isLoading = false;

        this.jsonData = res;
        if (this.jsonData.status == false) {
          this.router.navigate(['/']);
        }
        this.rebateItemList = this.jsonData.result.items;
        this.rebateItemCount = this.rebateItemList.length;
        this.rebateType = this.jsonData.result.rebateType;
        this.currentRebateID = this.jsonData.result.currentRebateID;

        this.customerName = this.jsonData.result.customer_name;
        this.customerID = this.jsonData.result.customer_id;
        this.fleetID = this.jsonData.result.customer_id;
        this.notes = this.jsonData.result.notes == 'null' ? '' : this.jsonData.result.notes;
        this.expiration = this.jsonData.result.expiration;
        this.earnedDiscount = this.jsonData.result.earned_discount;
        this.BranchId = this.jsonData.result.BranchId;
        this.acctService.setBranchId(this.BranchId);
        this.NP_CustomerID = this.jsonData.result.NP_CustomerID;
        this.acctService.setNP_CustomerID(this.NP_CustomerID);
        //this.rebateSatus = this.jsonData.result.rebate_status;


        //console.log('current date', this.datePipe.transform(this.expiration, 'MM-dd-yyyy')!);
        this.isExpired = this.compare(new Date(this.expiration), new Date(currentDate), false);
        if (this.earnedDiscount == 'Not Set') {
          this.isExpired = 1;
        }
        //console.log('expired', isExpired);
        //console.log('rebate status' + this.dataRebateStatus);
        this.rebateSatus = this.jsonData.result.rebate_status;//this.dataRebateStatus == 'NotCurrentlyEnrolled' ? 'Draft' : this.dataRebateStatus;
        this.statusSettings(this.rebateSatus);
        if (this.isExpired === -1 && this.rebateSatus == 'Draft') {
          this.rebateSatus = this.earnedDiscount + "% until " + this.expiration;
        }

        this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
        this.totalPoints = this.getTotalPoints();
        this.totalRebate = this.getTotalCost();
        this.loaderService.hide();
      });

    }
    /*console.log(this.rebateType);
    if (this.rebateType == 'Military') {
      this.showTotalPointsDiv = true;
    } else {
      this.showTotalPointsDiv = false;
    }*/
    //console.log("rebateType" + this.rebateType);
    if (this.rebateType == 'Bid Assist') {
      this.isReadOnly = false;
    } else {
      this.isReadOnly = true;
    }
    //});
  }
  
  getTotalCost() {
    return this.rebateItemList.map(t => Number(t.rebate)).reduce((acc, value) => acc + value, 0).toFixed(2);
  }

  getProSawSkus() {
    this.service.getProSawSkuList().subscribe(res => {
      //this.isLoading = false;
      this.jsonData = res;
      this.proSawArray = this.jsonData.result;
    });
  }

  getTotalPoints() {
    let calc_total_points = 0;
    let proSawChainCount = 0;
    this.isProSawItemContain = false;

    this.rebateItemList = this.rebateItemList.map(item => {
      calc_total_points += item.points;

      if (this.proSawArray.includes(item.sku)) {
        proSawChainCount += 1;
      }
      return item;
    });

    if (proSawChainCount > 2) {
      calc_total_points += 3;
      this.isProSawItemContain = true
    }
    if (proSawChainCount > 4 && calc_total_points < 8) {
      calc_total_points += 3;
    }

    return calc_total_points;
    //return this.rebateItemList.map(t => Number(t.points)).reduce((acc, value) => acc + value, 0);
  }

  deleteItem(itemID: string, rowid: number, description: string, sku: string, serial: string) {

    if (rowid > -1) {
      const itemDesc = description + ";" + sku + ";" + serial;
      const dialogRef = this.dialog.open(DeleteitemComponent, { data: { itemDesc: itemDesc } });
      dialogRef.componentInstance.deletedItemId.subscribe((data: any) => {
        this.isRebateModified = true;
        this.deleteItemIds = itemID + ',' + this.deleteItemIds;
        this.rebateItemList.splice(rowid, 1);
        //this.rebateItemList = [...this.rebateItemList]; // new ref!
        let successMessage = 'Deleted successfully.';
        this.snackBar.open(successMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['red-snackbar'] // You can define this class in your CSS
        });
        this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
        this.totalPoints = this.getTotalPoints();
        this.totalRebate = this.getTotalCost();
        this.rebateItemCount = this.rebateItemList.length;
        if (this.rebateType == 'Fleet') {
          this.RecalculateRebate();
        }
      });

    }
  }

  updateQueryParams(rid: string): void {
    // Example: Adding or updating query parameters
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { rid: rid },  // Update or add parameters
      queryParamsHandling: 'merge',  // Merge with existing parameters
    });
  }

  createRebate(isSubmit: string) {
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('fleet_type', this.rebateType);
    // Check if customerID is empty or null
    const customerID = this.customerID || this.acctService.getParentId();
    // Ensure customerID is a valid string (either from this.customerID or from getParentId)
    const customerIDString = customerID !== null ? customerID.toString() : ''; // Default to an empty string if null
    // Append the customer_id to the formData
    formData.append('customer_id', customerIDString);
    formData.append('child_id', this.datachildID);//this.datachildID
    formData.append('tags', "[SuperFleet][UberFleet]");
    this.service.createRebate(formData).subscribe(res => {
      this.jsonData = res;
      this.currentRebateID = this.jsonData.result;
      //if (isSubmit == '0') {        
      if (this.rebateSatus == 'NotCurrentlyEnrolled') {
        this.rebateSatus = 'Draft';
      }

      this.statusStyleClass = 'draft';
      this.isVisible = false;
      /*const messageData = 'Your rebate is saved.';
      const dialogRef = this.dialog.open(SubmitrebateComponent, { data: { messageData: messageData, headerData: 'Save Rebate', isSubmit: '0' } });
      setTimeout(() => {
        dialogRef.close();
      }, 5000); // 10000 milliseconds = 10 seconds*/
      //}/**/
      if (this.dataRebateID == '0') {
        //this.updateQueryParams(this.jsonData.result);
      }
      //console.log("in create - this.currentRebateID" + this.currentRebateID);
      if (this.rebateType == 'Bid Assist' || this.rebateType == 'Military/First Responder') {
        this.updateRebate(isSubmit);
      } else {
        if (isSubmit == '1' && this.totalPoints < 6 && this.rebateType != 'National Account') {
          if (this.rebateType == 'Fleet' && this.isExpired === -1) {
            this.updateRebate(isSubmit);
          } else {
            this.updateRebate('2');
            const messageData = 'This rebate does not meet requirements';
            this.snackBar.open(messageData, 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['green-snackbar'] // Apply the custom CSS class here
            });
            //const dialogRef = this.dialog.open(SubmitrebateComponent, { data: { messageData: messageData, headerData: 'Submit Rebate', isSubmit: '0' } });
          }
        } else {
          //console.log("in save - this.currentRebateID" + this.currentRebateID);
          this.updateRebate(isSubmit);
        }
      }
      //this.dataService.setData(this.jsonData.result, 'NotCurrentlyEnrolled', this.datacompanyName, this.customerID, this.datachildID, this.rebateType);

    });
  }

  // Utility function to check if a string is already JSON stringified
  isJSONString(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  updateRebate(isSubmit: string) {
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('rebate_id', this.currentRebateID);
    formData.append('rebate_type', this.rebateType);
    // Ensure the value is always a string when appending to FormData
    formData.append(
      'rebateItemList',
      this.isJSONString(this.rebateItemList as unknown as string)
        ? (this.rebateItemList as unknown as string)
        : JSON.stringify(this.rebateItemList)
    );
    formData.append('customer_id', this.customerID);
    formData.append('total_points', this.totalPoints);
    formData.append('total_rebate', this.totalRebate);
    formData.append('tags', "[SuperFleet][UberFleet]");
    formData.append('notes', this.notes);
    if (/^(0,)+$/.test(this.deleteItemIds)) {
      formData.append('delete', '');
    } else {
      formData.append('delete', String(this.deleteItemIds));
    }    
    formData.append('submit', isSubmit);
    if (this.rebateType === 'National Account') {
      const branchID = this.acctService.getBranchId();
      formData.append('branchID', branchID?.toString() || '');
    
      const NP_CustomerID = this.acctService.getNP_CustomerID();
      formData.append('NP_CustomerID', NP_CustomerID?.toString() || '');
    }    
  
    this.service.updateRebate(formData).subscribe({
      next: (res) => {
        this.jsonData = res;
        this.referenceNo = this.jsonData.result.reference_number;
  
        if (isSubmit === '1') {
          this.rebateSatus = 'Waiting';
          this.statusStyleClass = 'waiting';
          this.isVisible = true;
          this.isVisibleSubmit = false;
          this.OpenUploadinv();
          this.loadRebates(this.currentRebateID);
        } else {
          if (isSubmit === '0') {
            const messageData = 'Your rebate is saved.';
            this.snackBar.open(messageData, 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['green-snackbar'] // Apply the custom CSS class here
            });
          }
          this.statusStyleClass = 'draft';
          this.isVisible = false;
          this.loadRebates(this.currentRebateID);
        }
      },
      error: (err) => {
        console.error('Error updating rebate:', err);
  
        // Handle specific error status
        if (err.status === 500) {
          const errorMessage = 'An internal server error occurred. Please try again later.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['red-snackbar'] // Apply a red snackbar for error
          });
        } else {
          const errorMessage = 'An unexpected error occurred. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['red-snackbar'] // Apply a red snackbar for generic error
          });
        }
        this.loaderService.hide();
      },
      complete: () => {
        setTimeout(() => {
          this.isSaving = false; // Re-enable the button after 3 seconds
        }, 3000);
        this.deleteItemIds = ''; // Reset deleteItemIds
        this.loaderService.hide(); // Hide the loader after the request is completed
      }
    });
  }  

  loadRebates(rebate_id: any) {
    const formData = new FormData();

    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('rebate_id', rebate_id);

    this.service.getRebateItemList(formData).subscribe(res => {
      //this.isLoading = false;

      this.jsonData = res;
      if (this.jsonData.status == false) {
        this.router.navigate(['/']);
      }
      this.rebateItemList = this.jsonData.result.items;
      this.rebateType = this.jsonData.result.rebateType;
      this.currentRebateID = this.jsonData.result.currentRebateID;

      this.customerName = this.jsonData.result.customer_name;
      this.customerID = this.jsonData.result.customer_id;
      this.fleetID = this.jsonData.result.customer_id;
      this.notes = this.jsonData.result.notes == 'null' ? '' : this.jsonData.result.notes;
      this.expiration = this.jsonData.result.expiration;
      this.earnedDiscount = this.jsonData.result.earned_discount;
      //this.rebateSatus = this.jsonData.result.rebate_status;

      const currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy HH:mm:ss')!;
      //console.log('current date', this.datePipe.transform(this.expiration, 'MM-dd-yyyy')!);
      this.isExpired = this.compare(new Date(this.expiration), new Date(currentDate), false);
      //console.log('expired', isExpired);
      //console.log('rebate status' + this.dataRebateStatus);
      this.rebateSatus = this.jsonData.result.rebate_status;//this.dataRebateStatus == 'NotCurrentlyEnrolled' ? 'Draft' : this.dataRebateStatus;
      this.statusSettings(this.rebateSatus);
      if (this.isExpired === -1 && this.rebateSatus == 'Draft') {
        this.rebateSatus = this.earnedDiscount + "% until " + this.expiration;
      }

      this.dataSource = new MatTableDataSource<RebateItem>(this.rebateItemList);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
      this.totalPoints = this.getTotalPoints();
      this.totalRebate = this.getTotalCost();
      this.loaderService.hide();
    });
  }

  saveRebate(isSubmit: string) {
    this.isSaving = true; // Disable the button
    this.isRebateModified = false;
    if (this.currentRebateID == '') {
      this.createRebate(isSubmit);
    } else {
      //console.log('this.totalPoints' + this.rebateSatus)
      if (this.rebateType == 'Bid Assist' || this.rebateType == 'Military/First Responder') {
        this.updateRebate(isSubmit);
      } else {
        if (isSubmit == '1' && this.totalPoints < 6 && this.rebateType != 'National Account') {
          //console.log("this.isExpired-" + this.isExpired);
          if (this.rebateType == 'Fleet' && this.isExpired === -1) {
            this.updateRebate(isSubmit);
          } else {
            const messageData = 'This rebate does not meet requirements';
            this.snackBar.open(messageData, 'Close', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['red-snackbar'] // Apply the custom CSS class here
            });
            //const dialogRef = this.dialog.open(SubmitrebateComponent, { data: { messageData: messageData, headerData: 'Submit Rebate', isSubmit: '0' } });
            this.updateRebate('2');
          }
        } else {
          //console.log("in save - this.currentRebateID" + this.currentRebateID);
          this.updateRebate(isSubmit);
        }
      }
    }
  }

  applyFilter(filterValue: string) {
    console.log("selected filter value:" + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  isExpanded: boolean = false;
  toggleExpand(event: MouseEvent) {
    this.isExpanded = !this.isExpanded;
    const clickedElement = event.target as HTMLElement;
    const target = event.target as HTMLElement;
    const parentElement = target.closest('tr');

    if (parentElement) {
      const children = parentElement.children; // This gives you the HTMLCollection of child elements
      // Optionally, you can convert the HTMLCollection to an array
      const childArray = Array.from(children);
      for (let i = 0; i < children.length; i++) {

        if (this.isExpanded) {
          this.renderer.addClass(children[i], 'expanded');
          this.renderer.addClass(clickedElement, 'btn_collapse');
        } else {
          this.renderer.removeClass(children[i], 'expanded');
          this.renderer.removeClass(clickedElement, 'btn_collapse');
        }
      }

    }
  }

  closeClick() {
    if (this.isRebateModified === true) {
      const messageData = 'You have unsaved changes in your current rebate.';
      const dialogRef = this.dialog.open(SubmitrebateComponent, {
        data: {
          messageData: messageData,
          headerData: 'Are you sure you want to discard the changes?',
          isSubmit: '3'
        }
      });
    } else {
      // Check if 'oauth' exists in the current URL
      let oauth = this.activatedRoute.snapshot.queryParamMap.get('oauth');
      let acctParam: string;
      // Set acct based on the presence of enableUrlEncryption
      if (this.enableUrlEncryption && oauth !== 'isDev') {
        acctParam = this.encryptionService.encrypt(this.account);
      } else {
        acctParam = this.account;
      }
      // Set up query parameters, including oauth if it exists
      const queryParams: any = {
        acct: acctParam,
      };
      if (oauth) {
        queryParams.oauth = oauth;  // Add oauth if present
      }
      // Navigate to the new route with query parameters
      this.router.navigate(['/myrebates'], {
        queryParams: queryParams,
      });
    }
  }

  generateUniqueId(d: number): string {
    const uniqueString = Math.random().toString(36).substr(2, 16); // Generate 16-character random string
    return `${uniqueString}_${d}`; // Append the index to the random string
  }  
  
}


