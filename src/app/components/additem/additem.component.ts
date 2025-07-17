import { Component, ElementRef, OnChanges, OnInit, Input, ViewChild, EventEmitter, Output, Inject, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdditemService } from './additem.service';
import { RebateComponent } from '../rebate/rebate.component';
import { RebateItem } from '../rebate/rebate.component';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface SearchResult {
  date: Date;
  sku: number;
  description: string;
  serialno: string;
  retail: number;
}

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export class AdditemComponent implements OnInit {
  @Output() rebateItemCreated = new EventEmitter<{ action: string, sku: string, serial: string, invoice: string, price: string }>();

  sku: any | null = null;;
  serial: any | null = null;;
  invoice: any | null = null;;
  price: any | null = null;;
  action: any;
  displayedColumns: string[] = ['sku', 'date', 'description', 'serialno', 'retail'];

  jsonData: any;
  invoicelist !: SearchResult[];
  isShowSearchItemDiv = false;
  isShowResultTableDiv = true;
  isShowAddManuallyDiv = true;
  isVisible: boolean = true;
  searchText = '';
  account: any;
  cc: any;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  dataSource: any;
  assetUrl = environment.assetUrl;
  selectedToggleValue: string = 'searchitems';
  isLoading: boolean = false;
  constructor(private snackBar: MatSnackBar, private renderer: Renderer2, private loaderService: LoaderService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe, private acctService: AccountService, public dialogRef: DialogRef, private service: AdditemService, private dialog: MatDialog, private elementRef: ElementRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  ngOnInit(): void {
    //this.manualEntryErrorMessage = this.data.messageData;
    /*if(this.data.messageData != ''){
      this.selectedToggleValue = 'addmanually';
      this.toggleAddItemDiv();
    }*/
  }
  toggleAddItemDiv() {
    this.isShowSearchItemDiv = true;
    //this.isShowResultTableDiv = !this.isShowResultTableDiv;
    this.isShowAddManuallyDiv = false;
    this.isShowResultTableDiv = true;
    this.isVisible = false;
  }
  toggleSearchItemDiv() {
    this.isShowSearchItemDiv = false;
    //this.isShowResultTableDiv = !this.isShowResultTableDiv;
    this.isShowAddManuallyDiv = true;
    this.isShowResultTableDiv = true;
    this.isVisible = true;

  }
  closeDialogPopUp() {
    this.dialogRef.close();
  }
  manualEntryErrorMessage: string | null = null;
  addManualEntry() {
    this.sku = this.elementRef.nativeElement.querySelector('#sku').value.trim();
    this.serial = this.elementRef.nativeElement.querySelector('#serial').value.trim();
    this.invoice = this.elementRef.nativeElement.querySelector('#invoice').value.trim();
    if (this.sku == '' || this.serial == '' || this.invoice == '') {
      this.manualEntryErrorMessage = 'You must enter SKU, Invoice Number and Serial Number.';

    } else {
      this.rebateItemCreated.emit({ action: 'add', sku: this.sku, serial: this.serial, invoice: this.invoice, price: this.price });
      //this.dialogRef.close();
      this.manualEntryErrorMessage = null;
    }
  }
  clearFields(): void {
    this.manualEntryErrorMessage = null;
    this.elementRef.nativeElement.querySelector('#sku').value = '';
    this.elementRef.nativeElement.querySelector('#serial').value = '';
    this.elementRef.nativeElement.querySelector('#invoice').value = '';
    this.elementRef.nativeElement.querySelector('#price').value = '';
  }
  searchSerial: string = '';
  searchModel: string = '';
  searchSKU: string = '';
  searchInv: string = '';
  searchErrorMessage: string | null = null;
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

  validateSearch(): boolean {
    this.searchSKU = this.elementRef.nativeElement.querySelector('#searchSKU').value.trim();
    this.searchSerial = this.elementRef.nativeElement.querySelector('#searchSerial').value.trim();
    this.searchModel = this.elementRef.nativeElement.querySelector('#searchModel').value.trim();
    this.searchInv = this.elementRef.nativeElement.querySelector('#searchInv').value.trim();
    if (this.searchSKU == '' && this.searchSerial == '' && this.searchModel == '' && this.searchInv == '') {
      this.searchErrorMessage = 'You must enter something to search on.';
      return false;
    } else {
      this.searchErrorMessage = null;
    }
    return true;
  }
  
  searchInvoice() {
    this.dataSource = new MatTableDataSource<any>([]); // Reset the data
    if (this.validateSearch() === true) {
      this.isShowResultTableDiv = false;
      this.isLoading = true;
      this.loaderService.show();
      const formData = new FormData();
      this.account = this.acctService.getAccount();
      this.cc = 'USF';
  
      formData.append('account', this.account);
      formData.append('cc', this.cc);
      formData.append('sku', this.searchSKU);
      formData.append('serial', this.searchSerial);
      formData.append('model', this.searchModel);
      formData.append('invoice', this.searchInv);
  
      this.service.getInvoices(formData).subscribe({
        next: (res) => {
          this.jsonData = res;
  
          if (this.jsonData.result === 'NO_DATA') {
            this.invoicelist = [];
          } else {
            this.invoicelist = this.jsonData.result;
          }
  
          this.invoicelist = this.invoicelist.map((item) => {
            item.date = new Date(item.date);
            return item;
          });
  
          this.dataSource = new MatTableDataSource<SearchResult>(this.invoicelist);
          this.dataSource.paginator = this.paginatior;
          this.dataSource.sort = this.sort;
          this.sort.active = 'date';
          this.sort.direction = 'desc';
          this.dataSource.sort.sortChange.emit();
        },
        error: (err) => {
          console.error('Error fetching invoices:', err);
          this.handleError(err); // Call the error handling method
        },
        complete: () => {
          this.loaderService.hide();
          this.isLoading = false;
        },
      });
    }
  }
  
  handleError(error: any) {
    this.loaderService.hide();
    this.isLoading = false;
    let errorMessage = 'An unexpected error occurred.';
    if (error.status === 500) {
      errorMessage = 'Server error occurred. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = 'Network error. Please check your connection.';
    }
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['red-snackbar'], // Define this class in your styles for custom styling
    });
  }

  addSearchEntry(rowSku: string, rowSerial: string, rowInvoice: string, rowPrice: string) {
    this.rebateItemCreated.emit({ action: 'search', sku: rowSku, serial: rowSerial, invoice: rowInvoice, price: rowPrice });
    //this.dialogRef.close();
  }
  applyFilter(filterValue: string) {
    //console.log("selected filter value:" + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  // Custom sorting data accessor
  customSort(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sku': return this.compare_data(a.sku, b.sku, isAsc);
        case 'date': return this.compare_data(a.date, b.date, isAsc);
        case 'description': return this.compare_data(a.description, b.description, isAsc);
        case 'serialno': return this.compare_data(a.serialno, b.serialno, isAsc);
        case 'retail': return this.compare_data(a.retail, b.retail, isAsc);
        default: return 0;
      }
    });
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
}
