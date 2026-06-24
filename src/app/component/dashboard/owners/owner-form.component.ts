import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-owner-form',
  templateUrl: './owner-form.component.html'
})
export class OwnerFormComponent implements OnInit {
  form!: FormGroup;
  title: string; buttonName: string;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<OwnerFormComponent>) {
    this.title = data.title; this.buttonName = data.buttonName;
  }
  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id||''],
      name: [this.data.name||'', Validators.required],
      email: [this.data.email||'', [Validators.required, Validators.email]],
      mobile: [this.data.mobile||'', Validators.required],
      idNumber: [this.data.idNumber||'', Validators.required],
      bankDetails: [this.data.bankDetails||''],
      agreementDate: [this.data.agreementDate||''],
      managementFee: [this.data.managementFee??10, [Validators.required, Validators.min(0), Validators.max(100)]],
      approvalThreshold: [this.data.approvalThreshold??1000, Validators.required],
      status: [this.data.status||'Active'],
      notes: [this.data.notes||'']
    });
  }
  save() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.dialogRef.close(this.form.value); }
  cancel() { this.dialogRef.close(); }
}
