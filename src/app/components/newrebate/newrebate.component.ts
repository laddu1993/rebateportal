import { Component, ViewChild, ElementRef, Inject, Renderer2, OnInit } from '@angular/core';
import { NewRebateService } from './new-rebate.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator'; // Import for pagination event
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/services/account.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { postcodeValidator } from 'postcode-validator';
import { CreatecustomerComponent } from 'src/app/createcustomer/createcustomer.component';
import { LoaderService } from 'src/app/services/loader.service';
import { DataService } from 'src/app/services/data.service';
import { RebateItem } from '../rebate/rebate.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from 'src/app/services/device.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from 'src/app/services/encryption.service';

export interface ExistingCust {
  fleetid: string;
  expiration: string;
  company: string;
  city: string;
  parent_id?: string;
  fleet_id?: string;
}

interface NationalAccountOption {
  flag_type: string;
  fleet_id: string;
  national_account_name: string;
  id: number;
}

@Component({
  selector: 'app-newrebate',
  templateUrl: './newrebate.component.html',
  styleUrls: ['./newrebate.component.scss']
})

export class NewrebateComponent implements OnInit{
  isMobileDevice: boolean = false;
  //isLoading = true; // Loader state
  isValid = false;
  companyname: string | null = null;
  companynameErrorMessage: string | null = null;
  firstname: string | null = null;
  firstnameErrorMessage: string | null = null;
  lastName: string | null = null;
  lastNameErrorMessage: string | null = null;
  phone: any | null = null;
  phoneErrorMessage: string | null = null;
  email: any | null = null;
  emailErrorMessage: string | null = null;
  street: string | null = null;
  streetErrorMessage: string | null = null;
  city: string | null = null;
  cityErrorMessage: string | null = null;
  state: any | null = null;
  stateErrorMessage: string | null = null;
  zip: any | null = null;
  zipErrorMessage: string | null = null;
  form: FormGroup;
  natinalAccntOptions: any[] = [];
  totalRecords: number = 0; // To store the total number of records
  vlpageSize: number = 4; // Default page size
  vlpageIndex: number = 0; // Default page index
  isProduction = environment.production;
  enableUrlEncryption: boolean = environment.enableUrlEncryption;
  customerName: string | null = null;
  branchID: string | null = null;
  cityName: string | null = null;
  streetName: string | null = null;
  stateName: string | null = null;
  zipCode: string | null = null;
  rebateForm: FormGroup;
  searchForm!: FormGroup;
  searchCriteria = {
    firstName: '',
    lastName: '',
    email: '',
    state: '',
    companyName: '',
    zip: ''
  };
  // States list for the dropdown
  statesList = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'DC', name: 'District Of Columbia' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' }
  ];

  constructor(private encryptionService: EncryptionService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, private breakpointObserver: BreakpointObserver, private deviceService: DeviceService, private fb: FormBuilder, private datePipe: DatePipe, private dataService: DataService, private loaderService: LoaderService, private accountService: AccountService, public dialogRef: DialogRef, private service: NewRebateService, private dialog: MatDialog, private elementRef: ElementRef, private renderer: Renderer2, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      companyname: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]], // , Validators.pattern(/^\d{10}$/)For US 10-digit phone numbers
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // For US 5-digit zip codes
      street: ['', [Validators.required, Validators.minLength(3)]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3)]],
    });
    this.rebateForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)]],
      branchID: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]+$/)]],
      cityName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)]],
      streetName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s.,#-]+$/)]],
      stateName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)]], // Allows multi-word state names
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]] // US ZIP format
    });
    this.searchForm = this.fb.group({
      state: ['', Validators.required], // State is required
      firstName: [''],
      lastName: [''],
      email: [''],
      companyName: [''],
      zip: ['']
    });
  }
  //displayedColumns = ['company', 'city', 'expiration', 'fleetid'];
  displayedColumns: string[] = ['fleetid', 'expiration', 'company', 'city'];
  NatdisplayedColumns: string[] = ['fleetid', 'street', 'city', 'state', 'zip'];
  totalItems = 0;
  pageSize = 1000;
  pageIndex = 0;
  username: string = 'vinil@speridian.com';
  password: string = 'IUKhJMNPHGmYmOOBHC4MjQ==';
  messages: string[] = [];
  token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJJc3N1ZXIgb2YgdGhlIEpXVCIsImF1ZCI6IkF1ZGllbmNlIHRoYXQgdGhlIEpXVCIsInN1YiI6IlN1YmplY3Qgb2YgdGhlIEpXVCIsImlhdCI6MTcxNzU3NjMyMSwiZXhwIjoxNzE3NTc5OTIxLCJlbWFpbCI6ImdlZXRodW1vbC5nb3BpQHNwZXJpZGlhbi5jb20ifQ.70d5iZ-GXu1N3XnGFdQc86Wc5tMkmdandjbynUkwOCs";
  customerlist !: ExistingCust[];
  jsonData: any;
  dataSource: any;
  // Declare externalCustomerData as a MatTableDataSource
  externalCustomerData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  selectedToggleValue: string = 'existingCustomer';
  selectedValue: string = '';
  selectedRebatePgm: string = 'Fleet';
  selectedNationalAccountId: string = '';
  selectedNationalAccount: string = '';
  isVisible: boolean = true;
  searchText: string = '';
  searchExtText: string = '';
  account: any;
  cc: any;
  assetUrl = environment.assetUrl;
  searchBtn: boolean = false;
  showMilitaryFields: boolean = false; // Track whether to show military-specific fields
  isEmptySearch: boolean = false; // Flag for showing the dummy input form
  isDontShow: boolean = true;
  dummyCity: string = '';         // For storing the input city value
  dummyBranchName: string = '';   // For storing the input branch name

  loadcustomer() {
    
    this.loaderService.show();
    const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('fleet_type', this.selectedRebatePgm);
    formData.append('fleet_id', this.selectedNationalAccountId);
    formData.append('start', '0');//(this.pageIndex + 1).toString()
    formData.append('end', this.pageSize.toString());
    this.service.getCustomerList(formData).subscribe(res => {
    
      this.jsonData = res;
      if (this.jsonData.result == 'NO_DATA') {
        this.customerlist = [];
        this.isEmptySearch = true;
      } else {
        this.customerlist = this.jsonData.result;
        this.isEmptySearch = false;
      }

      if (this.customerlist && this.customerlist.length > 0 && this.selectedRebatePgm == 'National Account') {
        const firstCustomer = this.customerlist[0];
        // Convert parent_id to a number, or use a fallback value (e.g., 0)
        const parentId = firstCustomer.parent_id !== undefined && firstCustomer.parent_id !== null 
          ? Number(firstCustomer.parent_id)
          : null;
      
        const fleetId = firstCustomer.fleet_id ?? null;
        if (parentId !== null) {
          this.accountService.setParentId(parentId); // Safe to set since it's a number
        } else {
          console.error('Invalid Parent ID:', firstCustomer.parent_id);
        }
      
        if (fleetId !== null) {
          this.accountService.setBranchId(fleetId);
        } else {
          console.error('Invalid Fleet ID:', firstCustomer.fleet_id);
        }
      }      

      this.totalItems = this.jsonData.total_records ?? 0;
      this.paginator.length = this.totalItems;
      this.dataSource = new MatTableDataSource<ExistingCust>(this.customerlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sort.active = 'created';
      this.sort.direction = 'desc';
      this.sort.sortChange.emit(); // Trigger the sorting
      // if(!this.isProduction){
      //   this.loadNationalAccounsData();
      // }
      this.loaderService.hide();
    });
  }

  reorderColumns() {
    // Simple example of reversing columns for mobile devices
    this.displayedColumns = this.displayedColumns.reverse();
  }

  ngOnInit() {
    this.isMobileDevice = this.deviceService.isMobile();
    if(this.isMobileDevice === true){
      this.displayedColumns = ['company', 'city', 'expiration', 'fleetid'];
    }else{
      this.displayedColumns = ['fleetid', 'expiration', 'company', 'city'];
    }
    if (this.selectedRebatePgm === 'National Account') {
      // Adjust columns specifically for National Account
      this.NatdisplayedColumns = this.isMobileDevice 
        ? ['fleetid', 'street', 'city', 'state', 'zip', 'company']   // On Mobile: Show Branch ID & City only
        : ['fleetid', 'street', 'city', 'state', 'zip'];  // On Desktop: Hide Company, Show Branch ID & City
    }
    //console.log('Is mobile device:', this.isMobileDevice);
    this.account = this.data.account;
    this.cc = this.data.cc;
    this.loadcustomer();
  }

  onSubmit() {
    if (this.form.valid) {
      this.addCustomer();
      //this.form.reset();
      //console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form is not valid');
    }
  }
  buttonTag = this.elementRef.nativeElement.querySelector("div");

  isShowExistingCustomerDiv = false;
  isShowNewCustomerDiv = true;
  isShowButtonGroup = true;

  toggleDisplayDiv() {
    this.dataSource = new MatTableDataSource<ExistingCust>([]);  
    this.loadcustomer();
    this.form.reset();
    this.selectedToggleValue = 'existingCustomer';
  }

  toggleDisplayNewCustomerDiv() {
    this.loaderService.hide();
    this.selectedToggleValue = 'newCustomer';
  }
  
  toggleDisplayExternalCustomerDiv() {
    this.loaderService.hide();
    this.searchBtn = false;
    this.searchExtText = '';
    // Reset search criteria
    this.searchCriteria = {
      firstName: '',
      lastName: '',
      email: '',
      state: '',
      companyName: '',
      zip: ''
    };
    // Clear existing data by reinitializing as empty MatTableDataSource
    this.externalCustomerData = new MatTableDataSource<any>([]); // Reset the data
    this.dataSource = new MatTableDataSource([]);
    // this.loaderService.show();
    this.selectedToggleValue = 'externalCustomer';
    this.totalRecords = 0;
  }

  // Function to fetch data with pagination
  fetchExternalCustomerData(pageIndex: number, pageSize: number, companyName: string, state: string, zip: string, email: string, firstName: string, lastName: string) {
    this.service.getExternalOrgs(pageIndex, pageSize, companyName, this.selectedRebatePgm, state, email, zip, firstName, lastName).subscribe(res => {
      this.jsonData = res;
      
      // Initialize MatTableDataSource with the received data
      this.externalCustomerData.data = this.jsonData.result;

      // Set total count for pagination
      if (typeof this.externalCustomerData.data === 'string' && this.externalCustomerData.data === 'NO_DATA') {
        this.totalRecords = 0;
      } else if (Array.isArray(this.externalCustomerData.data)) {
        this.totalRecords = this.externalCustomerData.data.length;
      } else {
        this.totalRecords = 0; // Default to 0 if the data structure is unexpected
      }
      
      // Set paginator and sorting for MatTableDataSource
      this.externalCustomerData.paginator = this.paginator;
      this.externalCustomerData.sort = this.sort;

      this.loaderService.hide();
    });
  }

  // Handle page event for pagination
  onPageChange(event: PageEvent) {
    this.vlpageIndex = event.pageIndex;
    this.vlpageSize = event.pageSize;
    
    // Fetch data with updated pagination
    // this.fetchExternalCustomerData(this.pageIndex, this.pageSize, this.searchExtText);
  }

  applyExternalFilter() { 
    // Get the search value from the input field
    const searchValue = (document.getElementById('externalSearchInput') as HTMLInputElement).value.trim();
    // Check if the search value is empty
    if (!searchValue) {
      const errorMessage = 'Search field should not be empty';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['red-snackbar'] // Define this class in your CSS for styling
      });
      this.loaderService.hide(); // Ensure the loader is hidden if no search input
      return; // Exit the function
    }
    // Check if the search value has fewer than 3 characters
    if (searchValue.length < 2) {
      const errorMessage = 'Search field should contain at least 2 characters';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['red-snackbar'] // Define this class in your CSS for styling
      });
      this.loaderService.hide(); // Ensure the loader is hidden if input is too short
      return; // Exit the function
    }
    // Proceed with the filtering if the search value is valid
    this.externalCustomerData = new MatTableDataSource<any>([]); // Reset the data
    this.searchBtn = true;
    this.searchExtText = searchValue; // Assign the valid search value
    this.loaderService.show();
    this.vlpageIndex = 0;
    // this.fetchExternalCustomerData(this.vlpageIndex, this.vlpageSize, this.searchExtText);
  }

  searchCustomers(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched(); // Show validation errors if form is invalid
      return;
    }

    // Extract values from Reactive Form
    const { companyName, state, zip, email, firstName, lastName } = this.searchForm.value;

    // Reset table and show loader
    this.externalCustomerData = new MatTableDataSource<any>([]);
    this.searchBtn = true;
    this.loaderService.show();
    this.vlpageIndex = 0;

    this.fetchExternalCustomerData(
      this.vlpageIndex,
      this.pageSize,
      companyName,
      state,
      zip,
      email,
      firstName,
      lastName
    );
  }
  
  isShowNationalAccountDiv = true;
  isShowNationalAccountCustomerDiv = false;
  toggleNationalAccountDiv() {
    if (this.selectedRebatePgm == 'National Account') {
      this.isShowNationalAccountDiv = false;
      this.isShowNationalAccountCustomerDiv = true;
      this.isShowExistingCustomerDiv = true;
      this.isShowButtonGroup = true;
    } else {
      this.isShowNationalAccountDiv = true;
      this.isShowNationalAccountCustomerDiv = false;
      this.isShowExistingCustomerDiv = false;
      this.isShowButtonGroup = false;
    }
  }

  changeNationalAccount(selectedOption: NationalAccountOption) {
    // Reset rebate form fields
    this.rebateForm.reset();
    // Set the flag type dynamically using the selected option's flag_type.
    this.accountService.setFlagType(selectedOption.flag_type);
    // alert(selectedOption.flag_type);
    this.selectedNationalAccountId = selectedOption.fleet_id;
    this.accountService.setNP_CustomerID(selectedOption.fleet_id);
    // Reset the data source to an empty array for `ExistingCust`
    this.dataSource = new MatTableDataSource<ExistingCust>([]);
    // Assign the paginator to the data source
    this.dataSource.paginator = this.paginator;
    // Clear the search text to reset the filter
    this.isEmptySearch = false;
    this.isDontShow = false;
    // Reapply an empty filter
    //this.searchText = '';
    const inputElement = document.getElementById('vlSearchText') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = ''; // Clear input value
    }
    if (this.selectedRebatePgm === 'National Account') {
      //alert(selectedOption.national_account_name);
      if (selectedOption.national_account_name == 'SPREBER FAMILY OF COMPANIES') {
        // Always show company, regardless of screen size
        this.NatdisplayedColumns = ['company', 'fleetid', 'street', 'city', 'state', 'zip'];
      } else {
        // Normal behavior (hide company on mobile)
        this.NatdisplayedColumns = window.innerWidth <= 768
          ? ['fleetid', 'street', 'city', 'state', 'zip']
          : ['fleetid', 'street', 'city', 'state', 'zip'];
      }
    } else {
      // Default for non-National Accounts
      this.NatdisplayedColumns = ['company', 'fleetid', 'street', 'city', 'state', 'zip'];
    }
    // Load customer data
    this.loadcustomer();
  }  

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, ''); // Allow only digits
    input.value = filteredValue;
  }
  validation(): boolean {
    this.companyname = this.elementRef.nativeElement.querySelector('#companyName').value.trim();
    this.firstname = this.elementRef.nativeElement.querySelector('#firstName').value.trim();
    this.lastName = this.elementRef.nativeElement.querySelector('#lastName').value.trim();
    this.phone = this.elementRef.nativeElement.querySelector('#phone').value.trim();
    this.email = this.elementRef.nativeElement.querySelector('#email').value.trim();
    this.street = this.elementRef.nativeElement.querySelector('#street').value.trim();
    this.city = this.elementRef.nativeElement.querySelector('#city').value.trim();
    this.state = this.selectedValue.trim();
    this.zip = this.elementRef.nativeElement.querySelector('#zip').value.trim();
    if (this.companyname == '') {
      this.companynameErrorMessage = 'Company Name is required';

    } else {
      this.companynameErrorMessage = null;
    }
    if (this.firstname == '') {
      this.firstnameErrorMessage = 'First Name is required';

    } else {
      this.firstnameErrorMessage = null;
    }
    if (this.lastName == '') {
      this.lastNameErrorMessage = 'Last Name is required';

    } else {
      this.lastNameErrorMessage = null;
    }
    if (this.phone == '') {
      this.phoneErrorMessage = 'Phone Number is required';

    } else {
      var PHONE_REGEXP = /^\(\d{3}\)\s\d{3}-\d{4}$/;
      if (!PHONE_REGEXP.test(this.phone)) {
        this.phoneErrorMessage = "Please provide a valid phone number";

      }
      this.phoneErrorMessage = null;
    }
    if (this.email == '') {
      this.emailErrorMessage = 'Email is required';

    } else {
      var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

      if (!EMAIL_REGEXP.test(this.email)) {
        this.emailErrorMessage = "Please provide a valid email";

      } else {
        this.emailErrorMessage = null;
      }
    }
    if (this.street == '') {
      this.streetErrorMessage = 'Street is required';

    } else {
      this.streetErrorMessage = null;
    }
    if (this.city == '') {
      this.cityErrorMessage = 'City is required';

    } else {
      this.cityErrorMessage = null;
    }
    if (this.state == '') {
      this.stateErrorMessage = 'State is required';

    } else {
      this.stateErrorMessage = null;
    }
    if (this.zip == '') {
      this.zipErrorMessage = 'Zip is required';

    } else {

      /*const result = postcodeValidator(this.zip, this.state)
      if(result == false){
        this.zipErrorMessage = 'Please provide a valid zip code';
        return false;
      }*/
      this.zipErrorMessage = null;
    }
    if (this.companynameErrorMessage == null
      && this.firstnameErrorMessage == null && this.lastNameErrorMessage == null
      && this.phoneErrorMessage == null && this.emailErrorMessage == null
      && this.streetErrorMessage == null && this.cityErrorMessage == null
      && this.stateErrorMessage == null && this.zipErrorMessage == null
    ) {
      return true;
    } else {
      return false;
    }
  }

  clearFields(): void {
    this.form.reset();
    this.companynameErrorMessage = '';
    this.firstnameErrorMessage = '';
    this.lastNameErrorMessage = null;
    this.phoneErrorMessage = null;
    this.emailErrorMessage = null;
    this.streetErrorMessage = null;
    this.cityErrorMessage = null;
    this.stateErrorMessage = null;
    this.zipErrorMessage = null;
    this.elementRef.nativeElement.querySelector('#companyName').value = '';
    this.elementRef.nativeElement.querySelector('#firstName').value = '';
    this.elementRef.nativeElement.querySelector('#lastName').value = '';
    this.elementRef.nativeElement.querySelector('#phone').value = '';
    this.elementRef.nativeElement.querySelector('#email').value = '';
    this.elementRef.nativeElement.querySelector('#street').value = '';
    this.elementRef.nativeElement.querySelector('#city').value = '';
    this.selectedValue = '';
    this.elementRef.nativeElement.querySelector('#zip').value = '';
    // Reset search criteria (if not bound to the form directly)
    this.searchCriteria = {
      firstName: '',
      lastName: '',
      email: '',
      state: '',
      companyName: '',
      zip: ''
    };
  }

  addCustomer() {
    if (this.validation()) {
      this.loaderService.show();
  
      // Collect form data
      const formData = new FormData();
      formData.append('account', this.account);
      formData.append('cc', this.cc);
      formData.append('fleet_type', this.selectedRebatePgm);
      formData.append('customer_name', this.getInputValue('#companyName'));
      formData.append('first_name', this.getInputValue('#firstName'));
      formData.append('last_name', this.getInputValue('#lastName'));
      formData.append('phone', this.getInputValue('#phone'));
      formData.append('email', this.getInputValue('#email'));
      formData.append('street', this.getInputValue('#street'));
      formData.append('city', this.getInputValue('#city'));
      formData.append('state', this.selectedValue.trim());
      formData.append('zip', this.getInputValue('#zip'));
  
      // Call service to add a new customer
      this.service.addNewCustomer(formData).subscribe({
        next: (res) => {
          this.jsonData = res;
          this.loaderService.hide();
          if (this.jsonData.status === true) {
            this.showSnackbar('Customer created successfully!', 'green-snackbar');
            this.clearFields();
            this.loadcustomer();
            this.selectedToggleValue = 'existingCustomer';
          } else if (this.jsonData.error === 200) {
            let errorMessage = 'Duplicate email detected: Please use a unique email address.';
            // if (this.jsonData.messages?.errors) {
            //   try {
            //     const errorDetails = JSON.parse(this.jsonData.messages.errors);
            //     if (errorDetails?.message) {
            //       errorMessage = errorDetails.message.replace(
            //         "This email alerady exists:",
            //         "Duplicate email detected: Please use a unique email address: "
            //       );
            //     }
            //   } catch (e) {
            //     console.error('Error parsing response:', e);
            //   }
            // }
            this.showSnackbar(errorMessage, 'red-snackbar');
            return;
          } else {
            this.showSnackbar('Something went wrong!', 'red-snackbar');
          }
        },
        error: (err) => {
          this.loaderService.hide();
          console.error('Error while adding customer:', err);
          this.showSnackbar('Failed to add customer. Please try again.', 'red-snackbar');
        },
      });
    }
  }
  
  // Utility method to get input values and trim them
  private getInputValue(selector: string): string {
    const element = this.elementRef.nativeElement.querySelector(selector);
    return element ? element.value.trim() : '';
  }
  
  // Utility method to display snackbar messages
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }  

  changeRebatePgm(data: string) {
    this.searchText = ''; // Reset search input
    this.applyFilter(''); // Reset filter in case it's applied
    if (this.selectedRebatePgm == 'Military/First Responder') {
      // Show first name, last name, and email search fields
      this.showMilitaryFields = true;
    } else {
      // Show state, company name, zip, and email search fields
      this.showMilitaryFields = false;
    }
  
    if (this.selectedRebatePgm == 'National Account') {
      this.selectedToggleValue = 'existingCustomer';
      //if (!this.isProduction) {
        this.loadNationalAccounsData();
      //}
      this.isDontShow = true;
    }
  
    if (this.selectedToggleValue == 'existingCustomer') {
      this.selectedNationalAccountId = '';
      this.dataSource = new MatTableDataSource<ExistingCust>([]);
      this.dataSource.paginator = this.paginator;
      if (this.selectedRebatePgm != 'National Account') {
        this.loadcustomer();
      }
    }
  
    if (this.selectedToggleValue == 'externalCustomer') {
      this.externalCustomerData = new MatTableDataSource<any>([]);
      this.dataSource = new MatTableDataSource([]);
      this.toggleDisplayExternalCustomerDiv();
    }
  
    this.clearFields();
  }  

  closeDialogPopUp() {
    this.dialogRef.close();
  }
  // Utility function to compare dates
  private compare(a: Date, b: Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  rebateStatus: string = 'NotCurrentlyEnrolled';
  addRebate(customer_id: string, child_id: string, company_name: string, fleet_id: string, expiration: string, earned_discount: string) {
    //console.log("fleet_id" + fleet_id);
    const currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy HH:mm:ss')!;
    //console.log('current date', this.datePipe.transform(new Date(), 'MM-dd-yyyy HH:mm:ss')!);
    const isExpired = this.compare(new Date(expiration), new Date(currentDate), false);
    //console.log('expired', isExpired);

    if (isExpired === -1 && earned_discount != 'Not Set') {
      this.rebateStatus = earned_discount + "% until " + expiration;
    }
    this.dataService.setData('0', this.rebateStatus, company_name, customer_id, child_id, this.selectedRebatePgm, fleet_id, expiration, earned_discount);
    
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
    this.router.navigate(['/rebate'], {
      queryParams: queryParams,
    });
    
    this.dialogRef.close();
    /*const formData = new FormData();
    formData.append('account', this.account);
    formData.append('cc', this.cc);
    formData.append('fleet_type', this.selectedRebatePgm);
    formData.append('customer_id', customer_id);
    formData.append('child_id', child_id);
    formData.append('tags', "[SuperFleet][UberFleet]");
    this.service.createRebate(formData).subscribe(res => {
      this.dialogRef.close();
      this.jsonData = res;
      this.dataService.setData(this.jsonData.result, 'NotCurrentlyEnrolled', company_name, customer_id);
      this.router.navigate(['/rebate'], {
        queryParams: {
          acct: this.account          
        },
      });
    });*/
  }
  
  applyFilter(filterValue: string) {
    console.log("Selected filter value:" + filterValue);
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  
    // Check if the filtered data is empty
    if (this.dataSource.filteredData.length === 0) {
      this.isEmptySearch = true; // Flag to display the input fields
    } else {
      this.isEmptySearch = false; // Hide the input fields
    }
  }

  // Method to monitor input changes
  onInputChange(field: string, value: string) {
    console.log(`${field} changed:`, value);
  }

  get customerNameErrorMessage() {
    const control = this.rebateForm.get('customerName');
    if (control?.hasError('required')) {
      return 'Customer Name is required.';
    } else if (control?.hasError('pattern')) {
      return 'Customer Name must contain only alphabetic characters.';
    }
    return '';
  }

  get branchIDErrorMessage() {
    const control = this.rebateForm.get('branchID');
    if (control?.hasError('required')) {
      return 'Branch ID is required.';
    } else if (control?.hasError('pattern')) {
      return 'Branch ID must contain only alphanumeric characters.';
    }
    return '';
  }

  get cityNameErrorMessage() {
    const control = this.rebateForm.get('cityName');
    if (control?.hasError('required')) {
      return 'City is required.';
    } else if (control?.hasError('pattern')) {
      return 'City must contain only alphabetic characters.';
    }
    return '';
  }

  get streetNameErrorMessage() {
    const control = this.rebateForm.get('streetName');
    if (control?.hasError('required')) {
      return 'Street is required.';
    } else if (control?.hasError('pattern')) {
      return 'Street can contain letters, numbers, and special characters (.,#-).';
    }
    return '';
  }

  get stateNameErrorMessage() {
    const control = this.rebateForm.get('stateName');
    if (control?.hasError('required')) {
      return 'State is required.';
    } else if (control?.hasError('pattern')) {
      return 'State name can only contain letters and spaces.';
    }
    return '';
  }
  
  get zipCodeErrorMessage() {
    const control = this.rebateForm.get('zipCode');
    if (control?.hasError('required')) {
      return 'ZIP Code is required.';
    } else if (control?.hasError('pattern')) {
      return 'Enter a valid US ZIP Code (e.g., 12345 or 12345-6789).';
    }
    return '';
  }   
  
  addDummyCompany(city: string, branchName: string, Cname: string, street: string, state: string, zip: string) {
    if (this.rebateForm.invalid) {
      return;
    }

    // Trim input values to remove leading/trailing spaces
    branchName = branchName.trim();
    city = city.trim();
    Cname = Cname.trim();
    street = street.trim();
    state = state.trim();
    zip = zip.trim();

    const dummyCompany = {
      customer_id: '',
      child_id: '0',
      company_name: '',
      fleet_id: branchName,
      expiration: '12-31-1969',
      discount: '0',
    };

    const formData = new FormData();
    // Ensure all values are converted to strings or properly handled
    formData.append('name', Cname || ''); // Use an empty string as a fallback if Cname is null/undefined
    formData.append('city', city || ''); // Use an empty string as a fallback if city is null/undefined
    formData.append('branch', branchName || ''); // Use an empty string as a fallback if branchName is null/undefined
    formData.append('street', street || '');
    formData.append('state', state || '');
    formData.append('zip', zip || '');
    // Convert parentID to a string or handle null
    const parentID = this.accountService.getParentId();
    formData.append('pid', parentID !== null ? parentID.toString() : ''); // Fallback to an empty string if parentID is null
    this.accountService.setBranchId(branchName);
    
    // Make the API call
    this.service.createNationalAccount(formData).subscribe(
      (res) => {
        const response = res;
        if (response && response.status === true) {
          // Show green snackbar for success
          this.showSnackbar('New Branch created successfully!', 'green-snackbar');
          // Call addRebate with the dummy company details
          this.addRebate(
            dummyCompany.customer_id,
            dummyCompany.child_id,
            dummyCompany.company_name,
            dummyCompany.fleet_id,
            dummyCompany.expiration,
            dummyCompany.discount
          );
          // Reset the input fields
          this.dummyCity = '';
          this.dummyBranchName = '';
          this.isEmptySearch = false; // Hide the input form
        } else {
          // Show red snackbar for generic error
          this.showSnackbar('Something went wrong!', 'red-snackbar');
        }
      },
      (error) => {
        // Check if the API returned a valid JSON response with an error message
        if (error.status === 409 && error.error) {
          // Handle API error (e.g., duplicate branch ID)
          this.showSnackbar(error.error.message || 'Conflict error occurred.', 'red-snackbar');
          return; // Stop execution
        } else {
          // Handle generic network/server errors
          this.showSnackbar('Network error or server unreachable!', 'red-snackbar');
        }
      }
    );
  }  

  // Custom sorting data accessor
  customSort(sort: Sort) {
    if (!sort || !sort.active || sort.direction === '') {
      console.warn("Invalid sort event:", sort);
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fleetid': return this.compare_data(a.fleet_id, b.fleet_id, isAsc);
        case 'expiration': return this.compare_data(a.expiration, b.expiration, isAsc);
        case 'company': return this.compare_data(a.company_name, b.company_name, isAsc);
        case 'city': return this.compare_data(a.city, b.city, isAsc);

        default: return 0;
      }
    });
  }

  ExternalcustomSort(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.externalCustomerData.data = this.externalCustomerData.data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'fleetid': return this.compare_data(a.fleet_id, b.fleet_id, isAsc);
        case 'expiration': return this.compare_data(a.expiration, b.expiration, isAsc);
        case 'company': return this.compare_data(a.company_name, b.company_name, isAsc);
        case 'city': return this.compare_data(a.city, b.city, isAsc);
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

  private loadNationalAccounsData(): void {
    this.service.getNationalAccounts().subscribe(
      res => {
        this.jsonData = res;
        this.natinalAccntOptions = this.jsonData.result;
      },
      error => {
        console.error('Error fetching national accounts data', error);
      }
    );
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
