import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';
import { OwnerStatement } from 'src/app/shared/model/owner-statement';
import { StatementGenerateComponent } from './statement-generate.component';

@Component({ selector: 'app-statements', templateUrl: './statements.component.html', styleUrls: ['./statements.component.css'] })
export class StatementsComponent implements OnInit {
  displayedColumns = ['ownerName','periodStart','periodEnd','rentTotal','expenseTotal','feeTotal','payoutAmount','status','actions'];
  dataSource!: MatTableDataSource<OwnerStatement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar, public authApi: AuthService) {}
  ngOnInit() { this.load(); }
  load() {
    const p = this.authApi.getCurrentProfile();
    const obs = p?.role==='owner' ? this.dataApi.getStatementsByOwner(p.uid) : this.dataApi.getAllStatements();
    obs.subscribe(res => { const data = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); this.dataSource = new MatTableDataSource(data); this.dataSource.paginator = this.paginator; });
  }
  generate() {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '580px'; cfg.data = {};
    this.dialog.open(StatementGenerateComponent, cfg).afterClosed().subscribe(d => { if (d) this.snack.open('Statement generated!', 'OK', { duration: 3000 }); });
  }
  setStatus(row: any, status: string) { this.dataApi.updateStatement({ id: row.id, status }); this.snack.open('Status: '+status, 'OK', { duration: 3000 }); }
  recordPayout(row: any) {
    const ref = prompt('Bank transfer reference:'); if (!ref) return;
    this.dataApi.updateStatement({ id: row.id, payoutBankRef: ref, payoutDate: new Date().toISOString().split('T')[0], status: 'Paid' });
    this.snack.open('Payout recorded', 'OK', { duration: 3000 });
  }
  statusClass(s: string) { const m: any = {'Paid':'badge-green','Draft':'badge-grey','Sent':'badge-blue','Approved':'badge-teal','Disputed':'badge-red','Closed':'badge-grey'}; return m[s]||'badge-grey'; }
}
