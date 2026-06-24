import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material/material.module';

// Layout
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';

// Auth
import { LoginComponent } from './component/auth/login/login.component';
import { RegistrationComponent } from './component/auth/registration/registration.component';
import { VerifyComponent } from './component/auth/verify/verify.component';

// Dashboard - Existing
import { SidebarComponent } from './component/dashboard/sidebar/sidebar.component';
import { BuyComponent } from './component/dashboard/buy/buy.component';
import { SellComponent } from './component/dashboard/sell/sell.component';
import { SupportComponent } from './component/dashboard/support/support.component';
import { EnquiryComponent } from './component/dashboard/enquiry/enquiry.component';
import { AddpropertyComponent } from './component/dashboard/sell/addproperty/addproperty.component';
import { DeletepropertyComponent } from './component/dashboard/sell/deleteproperty/deleteproperty.component';
import { ViewpropertyComponent } from './component/dashboard/sell/viewproperty/viewproperty.component';
import { RequestcallbackComponent } from './component/dashboard/sell/viewproperty/requestcallback/requestcallback.component';

// Dashboard - New MVP Modules
import { AdminHomeComponent } from './component/dashboard/admin-home/admin-home.component';
import { OwnersComponent } from './component/dashboard/owners/owners.component';
import { OwnerFormComponent } from './component/dashboard/owners/owner-form.component';
import { UnitsComponent } from './component/dashboard/units/units.component';
import { UnitFormComponent } from './component/dashboard/units/unit-form.component';
import { TenantsComponent } from './component/dashboard/tenants/tenants.component';
import { TenantFormComponent } from './component/dashboard/tenants/tenant-form.component';
import { LeasesComponent } from './component/dashboard/leases/leases.component';
import { LeaseFormComponent } from './component/dashboard/leases/lease-form.component';
import { RentLedgerComponent } from './component/dashboard/rent-ledger/rent-ledger.component';
import { MaintenanceComponent } from './component/dashboard/maintenance/maintenance.component';
import { MaintenanceFormComponent } from './component/dashboard/maintenance/maintenance-form.component';
import { ExpensesComponent } from './component/dashboard/expenses/expenses.component';
import { ExpenseFormComponent } from './component/dashboard/expenses/expense-form.component';
import { StatementsComponent } from './component/dashboard/statements/statements.component';
import { StatementGenerateComponent } from './component/dashboard/statements/statement-generate.component';
import { ReportsComponent } from './component/dashboard/reports/reports.component';
import { VendorHomeComponent } from './component/dashboard/vendor-home/vendor-home.component';
import { TenantHomeComponent } from './component/dashboard/tenant-home/tenant-home.component';
import { SeedDataComponent } from './component/dashboard/seed-data/seed-data.component';

@NgModule({
  declarations: [
    AppComponent,
    // Auth
    LoginComponent, RegistrationComponent, VerifyComponent,
    // Existing Dashboard
    SidebarComponent, BuyComponent, SellComponent, SupportComponent, EnquiryComponent,
    AddpropertyComponent, DeletepropertyComponent, ViewpropertyComponent, RequestcallbackComponent,
    // New MVP Modules
    AdminHomeComponent,
    OwnersComponent, OwnerFormComponent,
    UnitsComponent, UnitFormComponent,
    TenantsComponent, TenantFormComponent,
    LeasesComponent, LeaseFormComponent,
    RentLedgerComponent,
    MaintenanceComponent, MaintenanceFormComponent,
    ExpensesComponent, ExpenseFormComponent,
    StatementsComponent, StatementGenerateComponent,
    ReportsComponent,
    VendorHomeComponent,
    TenantHomeComponent,
    SeedDataComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule, BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, AngularFireDatabaseModule, AngularFireStorageModule, AngularFireAuthModule,
    MaterialModule, LayoutModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatGridListModule, MatCardModule, MatSelectModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatChipsModule, MatMenuModule, MatTabsModule,
    MatTooltipModule, MatDividerModule, MatBadgeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
