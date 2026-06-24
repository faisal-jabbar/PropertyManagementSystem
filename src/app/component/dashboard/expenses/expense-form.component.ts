import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/service/data.service';

@Component({ selector: 'app-expense-form', templateUrl: './expense-form.component.html' })
export class ExpenseFormComponent implements OnInit {
  form!: FormGroup; title: string; buttonName: string;
  owners: any[] = []; properties: any[] = [];
  categories = ['Maintenance','Cleaning','Utilities','Security','Marketing','Legal','Management Fee','Other'];
  responsibilities = ['Owner','Tenant','Manager','Deducted from Rent'];

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExpenseFormComponent>, private dataApi: DataService) {
    this.title = data.title; this.buttonName = data.buttonName;
  }
  ngOnInit() {
    this.form = this.fb.group({
      ownerId: [this.data.ownerId||''], ownerName: [this.data.ownerName||''],
      propertyId: [this.data.propertyId||''], propertyName: [this.data.propertyName||''],
      category: [this.data.category||'', Validators.required],
      amount: [this.data.amount||'', [Validators.required, Validators.min(0.01)]],
      responsibility: [this.data.responsibility||'Owner', Validators.required],
      date: [this.data.date||new Date().toISOString().split('T')[0], Validators.required],
      description: [this.data.description||''], status: [this.data.status||'Pending']
    });
    this.dataApi.getAllOwners().subscribe(res => { this.owners = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
    this.dataApi.getAllProperty().subscribe(res => { this.properties = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
  }
  onOwnerChange(id: string) { const o = this.owners.find(x => x.id === id); if (o) this.form.patchValue({ ownerName: o.name }); }
  save() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.dialogRef.close({ ...this.form.value, createdAt: new Date().toISOString() }); }
  cancel() { this.dialogRef.close(); }
}
