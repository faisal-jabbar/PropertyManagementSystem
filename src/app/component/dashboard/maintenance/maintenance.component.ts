import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { MaintenanceTicket } from 'src/app/shared/model/maintenance-ticket';
import { MaintenanceFormComponent } from './maintenance-form.component';

@Component({ selector: 'app-maintenance', templateUrl: './maintenance.component.html', styleUrls: ['./maintenance.component.css'] })
export class MaintenanceComponent implements OnInit {
  displayedColumns = ['ticketNo','unitNo','category','priority','status','assignedVendorName','costEstimate','actions'];
  dataSource!: MatTableDataSource<MaintenanceTicket>;
  allTickets: MaintenanceTicket[] = []; selectedStatus = '';
  statuses = ['New','Under Review','Vendor Assigned','Quote Received','Waiting Approval','Approved','In Progress','Completed','Rejected','Closed'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar, public authApi: AuthService) {}
  ngOnInit() { this.load(); }

  load() {
    const p = this.authApi.getCurrentProfile();
    const obs = p?.role==='vendor' ? this.dataApi.getTicketsByVendor(p.uid) : p?.role==='tenant' ? this.dataApi.getTicketsByTenant(p.uid) : this.dataApi.getAllTickets();
    obs.subscribe(res => { this.allTickets = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); this.filter(); });
  }
  filter() { const f = this.selectedStatus ? this.allTickets.filter(t => t.status === this.selectedStatus) : this.allTickets; this.dataSource = new MatTableDataSource(f); this.dataSource.paginator = this.paginator; }
  search(ev: Event) { this.dataSource.filter = (ev.target as HTMLInputElement).value.trim().toLowerCase(); }

  add() {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '660px';
    cfg.data = { title: 'New Maintenance Request', buttonName: 'Submit' };
    this.dialog.open(MaintenanceFormComponent, cfg).afterClosed().subscribe(d => { if (d) this.snack.open('Ticket submitted!', 'OK', { duration: 3000 }); });
  }

  setStatus(row: any, status: string) {
    const p = this.authApi.getCurrentProfile();
    const h = row.statusHistory || [];
    h.push({ status, changedBy: p?.email||'admin', changedAt: new Date().toISOString() });
    this.dataApi.updateTicket({ id: row.id, status, statusHistory: h });
    this.snack.open('Status → ' + status, 'OK', { duration: 3000 });
  }
  assignVendor(row: any) {
    const name = prompt('Vendor name:'); if (!name) return;
    const p = this.authApi.getCurrentProfile(); const h = row.statusHistory||[];
    h.push({ status: 'Vendor Assigned', changedBy: p?.email||'admin', changedAt: new Date().toISOString() });
    this.dataApi.updateTicket({ id: row.id, assignedVendorName: name, status: 'Vendor Assigned', statusHistory: h });
    this.snack.open('Vendor assigned', 'OK', { duration: 3000 });
  }
  recordCost(row: any) {
    const c = parseFloat(prompt('Estimated cost (SAR):')||'0'); if (c <= 0) return;
    this.dataApi.updateTicket({ id: row.id, costEstimate: c, status: 'Quote Received' });
    this.snack.open('Cost recorded', 'OK', { duration: 3000 });
  }
  priorityClass(p: string) { const m: any = {'Urgent':'badge-red','High':'badge-orange','Medium':'badge-amber','Low':'badge-blue'}; return m[p]||'badge-grey'; }
  statusClass(s: string) { if(['Completed','Closed'].includes(s)) return 'badge-green'; if(['Rejected'].includes(s)) return 'badge-red'; if(['In Progress','Approved'].includes(s)) return 'badge-teal'; if(['Waiting Approval','Quote Received'].includes(s)) return 'badge-amber'; return 'badge-blue'; }
}
