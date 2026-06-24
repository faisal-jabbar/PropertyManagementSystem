import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './shared/guard/auth-guard.guard';
import { LoginComponent } from './component/auth/login/login.component';
import { RegistrationComponent } from './component/auth/registration/registration.component';
import { SidebarComponent } from './component/dashboard/sidebar/sidebar.component';
import { BuyComponent } from './component/dashboard/buy/buy.component';
import { SellComponent } from './component/dashboard/sell/sell.component';
import { SupportComponent } from './component/dashboard/support/support.component';
import { EnquiryComponent } from './component/dashboard/enquiry/enquiry.component';
import { ViewpropertyComponent } from './component/dashboard/sell/viewproperty/viewproperty.component';
import { AdminHomeComponent } from './component/dashboard/admin-home/admin-home.component';
import { OwnersComponent } from './component/dashboard/owners/owners.component';
import { UnitsComponent } from './component/dashboard/units/units.component';
import { TenantsComponent } from './component/dashboard/tenants/tenants.component';
import { LeasesComponent } from './component/dashboard/leases/leases.component';
import { RentLedgerComponent } from './component/dashboard/rent-ledger/rent-ledger.component';
import { MaintenanceComponent } from './component/dashboard/maintenance/maintenance.component';
import { ExpensesComponent } from './component/dashboard/expenses/expenses.component';
import { StatementsComponent } from './component/dashboard/statements/statements.component';
import { ReportsComponent } from './component/dashboard/reports/reports.component';
import { VendorHomeComponent } from './component/dashboard/vendor-home/vendor-home.component';
import { TenantHomeComponent } from './component/dashboard/tenant-home/tenant-home.component';
import { SeedDataComponent } from './component/dashboard/seed-data/seed-data.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'dashboard', component: SidebarComponent, canActivate: [AuthGuardGuard],
    children: [
      { path: '', redirectTo: 'admin-home', pathMatch: 'full' },
      { path: 'admin-home', component: AdminHomeComponent },
      { path: 'owner-home', component: AdminHomeComponent },
      { path: 'tenant-home', component: TenantHomeComponent },
      { path: 'vendor-home', component: VendorHomeComponent },
      { path: 'owners', component: OwnersComponent },
      { path: 'properties', component: SellComponent },
      { path: 'properties/:id', component: ViewpropertyComponent },
      { path: 'units', component: UnitsComponent },
      { path: 'tenants', component: TenantsComponent },
      { path: 'leases', component: LeasesComponent },
      { path: 'rent-ledger', component: RentLedgerComponent },
      { path: 'maintenance', component: MaintenanceComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'statements', component: StatementsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'enquiry', component: EnquiryComponent },
      { path: 'support', component: SupportComponent },
      { path: 'buy', component: BuyComponent },
      { path: 'sell', component: SellComponent },
      { path: 'sell/:id', component: ViewpropertyComponent },
      { path: 'seed-data', component: SeedDataComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
