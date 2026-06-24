import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/service/data.service';

@Component({ selector: 'app-lease-form', templateUrl: './lease-form.component.html', styleUrls: ['./lease-form.component.css'] })
export class LeaseFormComponent implements OnInit {
  form!: FormGroup; title: string; buttonName: string; isEdit: boolean;
  tenants: any[] = []; units: any[] = []; allUnits: any[] = [];

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LeaseFormComponent>, private dataApi: DataService) {
    this.title = data.title; this.buttonName = data.buttonName; this.isEdit = data.isEdit;
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id||''], tenantId: [this.data.tenantId||'', Validators.required], tenantName: [this.data.tenantName||''],
      unitId: [this.data.unitId||'', Validators.required], unitNo: [this.data.unitNo||''],
      propertyId: [this.data.propertyId||''], propertyName: [this.data.propertyName||''],
      startDate: [this.data.startDate||'', Validators.required], endDate: [this.data.endDate||'', Validators.required],
      rentAmount: [this.data.rentAmount||'', [Validators.required, Validators.min(1)]],
      deposit: [this.data.deposit||0], frequency: [this.data.frequency||'Monthly', Validators.required],
      status: [this.data.status||'Active'], ejarRef: [this.data.ejarRef||''], notes: [this.data.notes||'']
    });
    this.dataApi.getAllTenants().subscribe(res => { this.tenants = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
    this.dataApi.getAllUnits().subscribe(res => { this.allUnits = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); this.units = this.isEdit ? this.allUnits : this.allUnits.filter((u: any) => u.status === 'Vacant'); });
  }

  onTenantChange(id: string) { const t = this.tenants.find(x => x.id === id); if (t) this.form.patchValue({ tenantName: t.name }); }
  onUnitChange(id: string) { const u = this.allUnits.find(x => x.id === id); if (u) this.form.patchValue({ unitNo: u.unitNo, propertyId: u.propertyId }); }

  async save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const lease = { ...this.form.value, createdAt: new Date().toISOString() };
    if (this.isEdit) {
      await this.dataApi.updateLease(lease);
    } else {
      await this.dataApi.addLease(lease);
      await this.dataApi.updateUnit({ id: lease.unitId, status: 'Occupied' });
      await this.generateSchedule(lease);
    }
    this.dialogRef.close({ ...lease, isEdit: this.isEdit });
  }

  async generateSchedule(lease: any) {
    const start = new Date(lease.startDate); const end = new Date(lease.endDate);
    const today = new Date(); let cur = new Date(start);
    while (cur <= end) {
      const dueDate = cur.toISOString().split('T')[0];
      const diff = cur.getTime() - today.getTime();
      const status = diff < 0 ? 'Overdue' : diff < 7 * 86400000 ? 'Due' : 'Upcoming';
      await this.dataApi.addRentInstallment({ leaseId: lease.id, tenantId: lease.tenantId, tenantName: lease.tenantName, unitId: lease.unitId, unitNo: lease.unitNo, propertyId: lease.propertyId, dueDate, amount: lease.rentAmount, paidAmount: 0, status, createdAt: new Date().toISOString() });
      if (lease.frequency === 'Monthly') cur.setMonth(cur.getMonth() + 1);
      else if (lease.frequency === 'Quarterly') cur.setMonth(cur.getMonth() + 3);
      else cur.setFullYear(cur.getFullYear() + 1);
    }
  }
  cancel() { this.dialogRef.close(); }
}
