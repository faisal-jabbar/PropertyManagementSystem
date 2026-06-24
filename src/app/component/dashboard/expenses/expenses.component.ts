import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/service/data.service';
import { Expense } from 'src/app/shared/model/expense';
import { ExpenseFormComponent } from './expense-form.component';

@Component({ selector: 'app-expenses', templateUrl: './expenses.component.html', styleUrls: ['./expenses.component.css'] })
export class ExpensesComponent implements OnInit {
  displayedColumns = ['date','category','ownerName','propertyName','amount','responsibility','status','actions'];
  dataSource!: MatTableDataSource<Expense>; totalAmount = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.dataApi.getAllExpenses().subscribe(res => {
      const data = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.totalAmount = data.reduce((s: number, e: any) => s + (e.amount||0), 0);
      this.dataSource = new MatTableDataSource(data); this.dataSource.paginator = this.paginator;
    });
  }
  add() {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '620px';
    cfg.data = { title: 'Add Expense', buttonName: 'Save' };
    this.dialog.open(ExpenseFormComponent, cfg).afterClosed().subscribe(d => { if (d) { this.dataApi.addExpense(d); this.snack.open('Expense added', 'OK', { duration: 3000 }); } });
  }
  delete(id: string) { if (confirm('Delete expense?')) { this.dataApi.deleteExpense(id); this.snack.open('Deleted', 'OK', { duration: 3000 }); } }
  statusClass(s: string) { const m: any = {'Approved':'badge-green','Rejected':'badge-red','Pending':'badge-amber'}; return m[s]||'badge-grey'; }
}
