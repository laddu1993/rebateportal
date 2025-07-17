import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdditemComponent } from './components/additem/additem.component';
import { AddnotesComponent } from './components/addnotes/addnotes.component';
import { DeleteitemComponent } from './components/deleteitem/deleteitem.component';
import { DeleterebateComponent } from './components/deleterebate/deleterebate.component';
import { MyrebatesComponent } from './components/myrebates/myrebates.component';
import { NewrebateComponent } from './components/newrebate/newrebate.component';
import { RebateComponent } from './components/rebate/rebate.component';
import { UploadinvoiceComponent } from './components/uploadinvoice/uploadinvoice.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './helpers/token.interceptor';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { MatCardModule } from '@angular/material/card';
import { SubmitrebateComponent } from './submitrebate/submitrebate.component';
//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreatecustomerComponent } from './createcustomer/createcustomer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MatSortModule } from '@angular/material/sort';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PhoneMaskDirective } from './helpers/phone-mask.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    AdditemComponent,
    AddnotesComponent,
    DeleteitemComponent,
    DeleterebateComponent,
    MyrebatesComponent,
    NewrebateComponent,
    RebateComponent,
    UploadinvoiceComponent,
    LoginPageComponent,
    RegisterPageComponent,
    SubmitrebateComponent,
    CreatecustomerComponent,
    LoaderComponent,
    PhoneMaskDirective,
    SkeletonLoaderComponent,
    ProgressBarComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatTableModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    //MatProgressSpinnerModule,
    MatSortModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  providers: [CurrencyPipe, DatePipe, DecimalPipe],//{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  bootstrap: [AppComponent]
})
export class AppModule { }
