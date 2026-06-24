import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-statement-generate',
  templateUrl: './statement-generate.component.html',
  styleUrls: ['./statement-generate.component.css']
})
export class StatementGenerateComponent implements OnInit {
  owners: any[] = []; selectedOwner: any = null;
  periodStart = ''; periodEnd = ''; notes = '';
  calculated = false;
  rentTotal = 0; expenseTotal = 0; feeTotal = 0; payoutAmount = 0;

  constructor(private dataApi: DataService, private dialogRef: MatDialogRef<StatementGenerateComponent>) {}
  ngOnInit() { this.dataApi.getAllOwners().subscribe(res => { this.owners = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); }); }

  calculate() {
    if (!this.selectedOwner || !this.periodStart || !this.periodEnd) { alert('Fill all fields first'); return; }
    this.dataApi.getAllInstallments().subscribe(res => {
      const items = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.rentTotal = items.filter((i: any) => i.status==='Paid' && i.dueDate>=this.periodStart && i.dueDate<=this.periodEnd).reduce((s: number, i: any) => s+(i.paidAmount||0), 0);
      this.dataApi.getExpensesByOwner(this.selectedOwner.id).subscribe(res2 => {
        const exps = res2.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
        this.expenseTotal = exps.filter((e: any) => e.date>=this.periodStart && e.date<=this.periodEnd && e.status==='Approved').reduce((s: number, e: any) => s+(e.amount||0), 0);
        this.feeTotal = Math.round(this.rentTotal * (this.selectedOwner.managementFee||10) / 100);
        this.payoutAmount = this.rentTotal - this.expenseTotal - this.feeTotal;
        this.calculated = true;
      });
    });
  }

  async save() {
    const stmt = { ownerId: this.selectedOwner.id, ownerName: this.selectedOwner.name, periodStart: this.periodStart, periodEnd: this.periodEnd, rentTotal: this.rentTotal, expenseTotal: this.expenseTotal, feeTotal: this.feeTotal, payoutAmount: this.payoutAmount, status: 'Draft', notes: this.notes, createdAt: new Date().toISOString() };
    await this.dataApi.addStatement(stmt);
    this.dialogRef.close(stmt);
  }
  cancel() { this.dialogRef.close(); }
}
