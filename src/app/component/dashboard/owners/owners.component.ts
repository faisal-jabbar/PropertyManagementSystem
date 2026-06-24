import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/service/data.service';
import { Owner } from 'src/app/shared/model/owner';
import { OwnerFormComponent } from './owner-form.component';

@Component({ selector: 'app-owners', templateUrl: './owners.component.html', styleUrls: ['./owners.component.css'] })
export class OwnersComponent implements OnInit {
  displayedColumns = ['name','email','mobile','managementFee','approvalThreshold','status','actions'];
  dataSource!: MatTableDataSource<Owner>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }

  load() {
    this.dataApi.getAllOwners().subscribe(res => {
      const data = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) { this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase(); }

  open(row?: any) {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '640px';
    cfg.data = row ? { ...row, title: 'Edit Owner', buttonName: 'Update' } : { title: 'Add Owner', buttonName: 'Save' };
    this.dialog.open(OwnerFormComponent, cfg).afterClosed().subscribe(data => {
      if (!data) return;
      if (data.id) { this.dataApi.updateOwner(data); this.snack.open('Owner updated', 'OK', { duration: 3000 }); }
      else { this.dataApi.addOwner(data); this.snack.open('Owner added', 'OK', { duration: 3000 }); }
    });
  }

  delete(id: string) {
    if (confirm('Delete this owner?')) { this.dataApi.deleteOwner(id); this.snack.open('Deleted', 'OK', { duration: 3000 }); }
  }
}
