import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({ selector: 'app-maintenance-form', templateUrl: './maintenance-form.component.html' })
export class MaintenanceFormComponent implements OnInit {
  form!: FormGroup; title: string; buttonName: string; units: any[] = [];
  categories = ['Plumbing','Electrical','HVAC/AC','Painting','Carpentry','Cleaning','Security','Elevator','Other'];
  priorities = ['Low','Medium','High','Urgent'];

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MaintenanceFormComponent>, private dataApi: DataService, private authApi: AuthService) {
    this.title = data.title; this.buttonName = data.buttonName;
  }
  ngOnInit() {
    this.form = this.fb.group({
      unitId: [this.data.unitId||'', Validators.required], unitNo: [''], propertyId: [''],
      tenantId: [''], tenantName: [''], category: [this.data.category||'', Validators.required],
      priority: [this.data.priority||'Medium', Validators.required], description: [this.data.description||'', Validators.required]
    });
    this.dataApi.getAllUnits().subscribe(res => { this.units = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
  }
  onUnitChange(id: string) { const u = this.units.find(x => x.id === id); if (u) this.form.patchValue({ unitNo: u.unitNo, propertyId: u.propertyId }); }
  async save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const p = this.authApi.getCurrentProfile();
    const ticket = { ...this.form.value, tenantId: p?.role==='tenant'?p.uid:'', tenantName: p?.role==='tenant'?p.name:'', ticketNo: 'TKT-'+Math.floor(Math.random()*90000+10000), status: 'New', statusHistory: [{ status:'New', changedBy:p?.email||'system', changedAt:new Date().toISOString() }], createdAt: new Date().toISOString() };
    await this.dataApi.addTicket(ticket);
    this.dialogRef.close(ticket);
  }
  cancel() { this.dialogRef.close(); }
}
