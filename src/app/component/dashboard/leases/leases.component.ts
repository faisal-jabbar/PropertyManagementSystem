import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/service/data.service';
import { Lease } from 'src/app/shared/model/lease';
import { LeaseFormComponent } from './lease-form.component';

@Component({ selector: 'app-leases', templateUrl: './leases.component.html', styleUrls: ['./leases.component.css'] })
export class LeasesComponent implements OnInit {
  displayedColumns = ['tenantName','unitNo','startDate','endDate','rentAmount','frequency','status','actions'];
  dataSource!: MatTableDataSource<Lease>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.dataApi.getAllLeases().subscribe(res => {
      const data = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.dataSource = new MatTableDataSource(data); this.dataSource.paginator = this.paginator;
    });
  }
  open(row?: any) {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '720px';
    cfg.data = row ? { ...row, title: 'Edit Lease', buttonName: 'Update', isEdit: true } : { title: 'Create Lease', buttonName: 'Create & Generate Schedule', isEdit: false };
    this.dialog.open(LeaseFormComponent, cfg).afterClosed().subscribe(r => { if (r) this.snack.open(r.isEdit ? 'Lease updated' : 'Lease created & schedule generated!', 'OK', { duration: 4000 }); });
  }
  terminate(row: any) {
    if (confirm('Terminate this lease?')) { this.dataApi.updateLease({ ...row, status: 'Terminated' }); this.snack.open('Lease terminated', 'OK', { duration: 3000 }); }
  }
  daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
  statusClass(s: string) { const m: any = {'Active':'badge-green','Expired':'badge-red','Terminated':'badge-red','Pending':'badge-amber'}; return m[s]||'badge-grey'; }
}
