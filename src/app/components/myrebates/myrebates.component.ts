import { Component, inject, ViewChild, ElementRef, Injectable, AfterViewInit, OnInit, Renderer2  } from '@angular/core';
import { NewrebateComponent } from '../newrebate/newrebate.component';
import { MatDialog } from '@angular/material/dialog';
import { Myrebates } from './myrebates';
import { MyRebatesService } from './my-rebates.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DeleterebateComponent } from '../deleterebate/deleterebate.component';
import { AccountService } from 'src/app/services/account.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LoaderService } from 'src/app/services/loader.service';
import { DataService } from 'src/app/services/data.service';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { DeviceService } from 'src/app/services/device.service';
import { SearchService } from 'src/app/services/search.service';
import { SubmitrebateComponent } from 'src/app/submitrebate/submitrebate.component';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ActivatedRoute } from '@angular/router';

// Define a custom comparator for date
const dateComparator = (a: Date | string, b: Date | string): number => {
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateA - dateB;
};

export interface RebateTable {
  customerinfo: string;
  datecreated: Date;
  reference_no: string;
  status: string;
  type: string;
  rebate: string;
}

@Component({
  selector: 'app-myrebates',
  templateUrl: './myrebates.component.html',
  styleUrls: ['./myrebates.component.scss']
})
export class MyrebatesComponent implements AfterViewInit {
  isMobile: boolean = false;
  isTablet: boolean = false;
  displayedColumns: string[] = ['customerinfo', 'datecreated', 'reference_no', 'status', 'type', 'rebate', 'action'];
  allData: any[] = []; // Complete dataset
  filteredData: any[] = []; // Data to be displayed in the table
  totalItems = 0;
  pageSize = 10000;
  pageIndex = 0;

  username: string = 'vinil@speridian.com';
  password: string = 'IUKhJMNPHGmYmOOBHC4MjQ==';
  messages: string[] = [];
  token: any;
  rebatelist !: Myrebates[];
  jsonData: any;
  dataSource: any;
  searchText: string = ''; // Initialize the search text
  account: any;
  cc: any;
  startDate: any;
  endDate: any;
  selectedToggleValue: string = 'inprogress';
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  //isLoading = true; // Loader state
  minDate: Date | null = null;
  maxDate: Date | null = null;
  isLoading = false;
  isPageRefreshed: boolean = false;
  isProduction = environment.production;
  isLoadingPopup: boolean = true;
  envName = environment.name;
  isUATMode: boolean = environment.production;
  enableUrlEncryption: boolean = environment.enableUrlEncryption;
  
  constructor(private activatedRoute: ActivatedRoute, private encryptionService: EncryptionService, private snackBar: MatSnackBar, private searchService: SearchService, private deviceService: DeviceService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private dataService: DataService, private loaderService: LoaderService, private elementRef: ElementRef, private accountService: AccountService, private authenticationService: AuthenticationService, private service: MyRebatesService, private dialog: MatDialog, private router: Router, private renderer: Renderer2) {
    this.accountService.setBranchId('');
    /*this.myRebatesList.getRebateList().then((myRebatesList: MyRebates[]) => {
      this.myRebatesList = myRebatesList;
    });*/
  }
  
  updateData(rID: string, rStatus: string): void {
    // Check if 'oauth' exists in the current URL
    let oauth = this.activatedRoute.snapshot.queryParamMap.get('oauth');
    // Declare acctParam outside of the if-else block for broader scope
    let acctParam: string;
    // Set acct based on the presence of enableUrlEncryption
    if (this.enableUrlEncryption && oauth !== 'isDev') {
      acctParam = this.encryptionService.encrypt(this.account);
    } else {
      acctParam = this.account;
    }
    this.dataService.setData(rID, rStatus, '', '', '', '', '', '', '','');
    // Set up query parameters, including oauth if it exists
    const queryParams: any = {
      acct: acctParam,
    };
    if (oauth) {
      queryParams.oauth = oauth;  // Add oauth if present
    }
    // Navigate to the new route with query parameters
    this.router.navigate(['/rebate'], {
      queryParams: queryParams,
    });
  }

  private compare(a: Date, b: Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  sanitizeCustomer(customer: string): string {
    return customer.replace(/<br\s*\/?>/gi, ' ');
  }

  loadmyrebates() {
    //this.searchText = '';
    this.loaderService.show();
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('start', '0');
    formData.append('end', this.pageSize.toString());

    this.service.getRebateList(formData, this.token).subscribe(res => {
        this.jsonData = res;
        // Debugging log to check the status code
        console.log('Response Code:', this.jsonData.code);
        // Check if status code is 403 and redirect to unauthorized page if so
        if (this.jsonData.code === 403) {
            this.router.navigate(['unauthorized']);
            return; // Exit the function to prevent further execution
        }

        if (this.jsonData.result === 'NO_DATA') {
          this.rebatelist = [];
        } else if (this.jsonData.status === 'Error') {
          const messageData = this.jsonData.errors;
          this.dialog.open(SubmitrebateComponent, { 
            data: { messageData, headerData: 'ERROR', isSubmit: '2' } 
          });
        } else {
          this.rebatelist = this.jsonData.result;
        }

        this.allData = this.rebatelist;
        this.totalItems = this.jsonData.total_records;

        this.rebatelist = this.rebatelist.map(item => {
          item.datecreated = new Date(item.datecreated);
          return item;
        });

        this.filterData();

        this.dataSource = new MatTableDataSource<Myrebates>(this.rebatelist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'datecreated';
        this.sort.direction = 'desc';
        this.sort.sortChange.emit(); // Trigger the sorting

        this.isLoading = false;
        this.loaderService.hide();
        this.applyFilter(this.searchText);
    });

    this.filteredData = [...this.allData];
  }


  applyDateFilter(): void {
    const startDate = this.minDate ? this.minDate.toISOString() : '';
    const endDate = this.maxDate ? this.maxDate.toISOString() : '';
    this.dataSource.filter = `${startDate}|${endDate}`;
  }

  OpenNewrebate(): void {
    this.dialog.open(NewrebateComponent, {  maxWidth: '90vw', data: { account: this.account, cc: this.cc } });
  }

  ngAfterViewInit() {
      
  }

  ngOnInit(): void {
    /*if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      this.isPageRefreshed = true;
      console.log('Page was refreshed');
    } else {
      console.log('Page was not refreshed');
    }*/
    //this.selectedToggleValue = this.searchService.getSearchTerm();
    //this.filterType = this.searchService.getSearchType();
    //this.searchText = this.searchService.getsearchKeyword();
    //this.dataService.setSearchTerm('inprogress');
    
    // Simulate data loading for popup content
    setTimeout(() => {
      this.isLoadingPopup = false;  // Set to false when data is ready
    }, 2000);  // Simulate a delay, replace with actual data loading logic
    
    this.dataService.dataRebateFilter$.subscribe(data => {
      this.selectedToggleValue = data;
    });
    
    this.dataService.dataRebateFilterType$.subscribe(data => {
      this.filterType = data;
    });
    this.dataService.dataRebateFilterSearch$.subscribe(data => {
      this.searchText = data;
    });
    this.account = this.accountService.getAccount();
    this.cc = 'USF';
    this.loadmyrebates();
  }

  /*ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      //this.pageIndex = this.paginator.pageIndex;
      //this.pageSize = this.paginator.pageSize;
      this.loadmyrebates();
    });
  }*/
  GoToRebate(data: string): void {
    this.router.navigate(['rebate']);
  }

  deleteRebate(rowid: number, rebateId: string, customerName: string, rebateStatus: string) {
    const dialogRef = this.dialog.open(DeleterebateComponent, { data: { rebateId: rebateId, customerName: customerName, rebateStatus: rebateStatus } });
    dialogRef.componentInstance.deletedRebateId.subscribe((data: any) => {
        const formData = new FormData();
        formData.append('account', this.account);
        formData.append('cc', this.cc);
        formData.append('rid', data.rebateId);

        // Remove the rebate from rebatelist
        this.rebatelist = this.rebatelist.filter(item => item.rebate_id !== rebateId);
        
        // Remove the rebate from allData as well
        this.allData = this.allData.filter(item => item.rebate_id !== rebateId);

        this.service.deleteRebate(formData).subscribe(res => {
            let successMessage = 'Deleted successfully.';
            this.snackBar.open(successMessage, 'Close', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['red-snackbar'] // You can define this class in your CSS
            });
            
            // Update data source with modified rebatelist
            this.dataSource = new MatTableDataSource<Myrebates>(this.rebatelist);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    });
  }

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return date.toDateString();
  }

  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.startDate = dateRangeStart.value;
    this.endDate = dateRangeEnd.value;
    console.log(dateRangeStart.value);
    console.log(dateRangeEnd.value);
    console.log(this.format(new Date(dateRangeStart.value), 'MM-dd-yyyy'));
  }
  
  applyCompletedFilter(filterValue: string) {
    this.searchText = ''; // Clear the search box
    this.filterData();
    /*const rtype = this.filterType;

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;*/
  }

  applyInprogressFilter() {
    this.searchText = ''; // Clear the search box
    this.filterData();
  }

  applyFilter(value: string): void {
    
    const filterValue = this.searchText;
    this.dataService.setsearchKeyword(this.searchText);
    //if(filterValue != ''){
      this.dataSource.filter = filterValue.trim().toLowerCase();
    //}
  }

  onSelectChange(event: any): void {
    this.filterType = event.value;
    this.dataService.setSearchType(this.filterType);
    this.filterData();
    //this.applyFilter(this.filterType);
  }

  private filterData(): void {
    
    this.dataService.setSearchTerm(this.selectedToggleValue);
    if (this.selectedToggleValue == 'completed') {
      //this.applyCompletedFilter('completed');
      this.filteredData = this.allData.filter(item => item.status === 'Completed');
    } else {
      //this.filterDataByStatus();
      this.filteredData = this.allData.filter(item => item.status != 'Completed');
    }

    if (this.filterType) {
      this.filteredData = this.filteredData.filter(item => item.type === this.filterType);
    } else {
      this.filteredData = [...this.filteredData];
    }
    this.rebatelist = this.filteredData;
    this.dataSource = new MatTableDataSource<Myrebates>(this.filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
  private filterDataByStatus(): void {

    if (this.selectedToggleValue == 'completed') {

      this.allData = [];
    }

  }
  filterType: string = '';
  filterDate: string = '';
  resetFilter() {
    this.selectedToggleValue = 'inprogress';
    //console.log('hi')
    this.filterType = '';
    this.filterDate = '';
    this.searchText = '';
    //this.searchService.clearSearchTerm();
    this.loadmyrebates();
  }
  // Custom sorting data accessor
  customSort(sort: Sort) {
    console.log('Sort Event:', sort);
    if (!sort || !sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      
      const isAsc = sort.direction === 'asc';
      console.log("sort.direction - " + isAsc);
      switch (sort.active) {
        case 'customerinfo': return this.compareString(a.customer, b.customer, isAsc);
        case 'reference_no': return this.compare_data(a.reference_no, b.reference_no, isAsc);
        case 'rebate': return this.compare_data(a.rebate, b.rebate, isAsc);
        case 'datecreated': return this.compare_data(a.datecreated, b.datecreated, isAsc);
        case 'status': return this.compare_data(a.status, b.status, isAsc);
        case 'type': return this.compare_data(a.type, b.type, isAsc);
        default: return 0;
      }
    });
  }
  private compareString(a: string, b: string, isAsc: boolean): number {
    return (a.localeCompare(b)) * (isAsc ? 1 : -1);
  }
  private compare_data(a: number | string | Date, b: number | string | Date, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    }
    if (a > b) {
      return isAsc ? 1 : -1;
    }
    return 0;
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
}
