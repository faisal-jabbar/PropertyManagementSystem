import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { RentInstallment } from 'src/app/shared/model/rent-installment';

@Component({ selector: 'app-rent-ledger', templateUrl: './rent-ledger.component.html', styleUrls: ['./rent-ledger.component.css'] })
export class RentLedgerComponent implements OnInit {
  displayedColumns = ['dueDate','tenantName','unitNo','amount','paidAmount','balance','status','actions'];
  dataSource!: MatTableDataSource<RentInstallment>;
  allItems: RentInstallment[] = []; selectedStatus = '';
  uploadingId: string|null = null;
  statuses = ['Upcoming','Due','Paid','Partially Paid','Overdue','Disputed','Waived'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataApi: DataService, private snack: MatSnackBar, public authApi: AuthService) {}
  ngOnInit() { this.load(); }

  load() {
    this.dataApi.getAllInstallments().subscribe(res => {
      this.allItems = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.filter();
    });
  }
  filter() {
    const f = this.selectedStatus ? this.allItems.filter(i => i.status === this.selectedStatus) : this.allItems;
    this.dataSource = new MatTableDataSource(f); this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort;
  }
  search(ev: Event) { this.dataSource.filter = (ev.target as HTMLInputElement).value.trim().toLowerCase(); }
  balance(r: RentInstallment) { return (r.amount||0) - (r.paidAmount||0); }

  uploadProof(item: RentInstallment, ev: any) {
    const file: File = ev.target.files[0]; if (!file) return;
    this.uploadingId = item.id;
    const path = `payment_proofs/${item.id}_${file.name}`;
    this.dataApi.uploadFile(path, file).subscribe(url => {
      this.dataApi.updateInstallment({ id: item.id, proofUrl: url });
      this.snack.open('Proof uploaded — awaiting verification', 'OK', { duration: 4000 }); this.uploadingId = null;
    });
  }
  recordPayment(item: RentInstallment) {
    const paid = parseFloat(prompt('Enter amount received (SAR):', String(item.amount))||'0');
    if (paid <= 0) return;
    const paidAmount = (item.paidAmount||0) + paid;
    const status = paidAmount >= item.amount ? 'Paid' : 'Partially Paid';
    this.dataApi.updateInstallment({ id: item.id, paidAmount, status });
    this.snack.open('Payment recorded: SAR ' + paidAmount, 'OK', { duration: 3000 });
  }
  verify(item: RentInstallment) {
    const p = this.authApi.getCurrentProfile();
    const status = (item.paidAmount||0) >= item.amount ? 'Paid' : 'Partially Paid';
    this.dataApi.updateInstallment({ id: item.id, status, verifiedBy: p?.email||'admin', verifiedAt: new Date().toISOString() });
    this.snack.open('Verified as ' + status, 'OK', { duration: 3000 });
  }
  waive(item: RentInstallment) { if (confirm('Waive this installment?')) this.dataApi.updateInstallment({ id: item.id, status: 'Waived' }); }

  statusClass(s: string) {
    const m: any = {'Paid':'badge-green','Overdue':'badge-red','Due':'badge-orange','Upcoming':'badge-blue','Partially Paid':'badge-amber','Waived':'badge-grey','Disputed':'badge-purple'};
    return m[s]||'badge-grey';
  }
}
