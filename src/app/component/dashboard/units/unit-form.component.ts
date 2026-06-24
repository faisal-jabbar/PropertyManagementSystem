import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({ selector: 'app-unit-form', templateUrl: './unit-form.component.html' })
export class UnitFormComponent implements OnInit {
  form!: FormGroup;
  title: string; buttonName: string; properties: any[] = [];
  statuses = ['Vacant','Occupied','Reserved','Under Maintenance','Legal Issue','Not Available'];
  types = ['Studio','1 BHK','2 BHK','3 BHK','4 BHK','Villa','Penthouse','Commercial','Warehouse'];
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<UnitFormComponent>) {
    this.title = data.title; this.buttonName = data.buttonName; this.properties = data.properties || [];
  }
  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id||''], propertyId: [this.data.propertyId||'', Validators.required],
      unitNo: [this.data.unitNo||'', Validators.required], floor: [this.data.floor||''],
      type: [this.data.type||'', Validators.required], bedrooms: [this.data.bedrooms||0],
      bathrooms: [this.data.bathrooms||0], targetRent: [this.data.targetRent||'', Validators.required],
      status: [this.data.status||'Vacant', Validators.required]
    });
  }
  save() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.dialogRef.close(this.form.value); }
  cancel() { this.dialogRef.close(); }
}
