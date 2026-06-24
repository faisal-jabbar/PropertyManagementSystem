import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({ selector: 'app-tenant-form', templateUrl: './tenant-form.component.html' })
export class TenantFormComponent implements OnInit {
  form!: FormGroup; title: string; buttonName: string;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<TenantFormComponent>) {
    this.title = data.title; this.buttonName = data.buttonName;
  }
  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id||''], name: [this.data.name||'', Validators.required],
      email: [this.data.email||'', [Validators.required, Validators.email]],
      mobile: [this.data.mobile||'', Validators.required], idNumber: [this.data.idNumber||'', Validators.required],
      employer: [this.data.employer||''], emergencyContact: [this.data.emergencyContact||''],
      status: [this.data.status||'Active']
    });
  }
  save() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.dialogRef.close(this.form.value); }
  cancel() { this.dialogRef.close(); }
}
