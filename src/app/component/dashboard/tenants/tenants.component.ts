import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/service/data.service';
import { Tenant } from 'src/app/shared/model/tenant';
import { TenantFormComponent } from './tenant-form.component';

@Component({ selector: 'app-tenants', templateUrl: './tenants.component.html', styleUrls: ['./tenants.component.css'] })
export class TenantsComponent implements OnInit {
  displayedColumns = ['name','email','mobile','idNumber','employer','status','actions'];
  dataSource!: MatTableDataSource<Tenant>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.dataApi.getAllTenants().subscribe(res => {
      const data = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.dataSource = new MatTableDataSource(data); this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }
  open(row?: any) {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '620px';
    cfg.data = row ? { ...row, title: 'Edit Tenant', buttonName: 'Update' } : { title: 'Add Tenant', buttonName: 'Save' };
    this.dialog.open(TenantFormComponent, cfg).afterClosed().subscribe(data => {
      if (!data) return;
      if (data.id) { this.dataApi.updateTenant(data); this.snack.open('Updated', 'OK', { duration: 3000 }); }
      else { this.dataApi.addTenant(data); this.snack.open('Tenant added', 'OK', { duration: 3000 }); }
    });
  }
  delete(id: string) { if (confirm('Delete tenant?')) { this.dataApi.deleteTenant(id); this.snack.open('Deleted', 'OK', { duration: 3000 }); } }
}
