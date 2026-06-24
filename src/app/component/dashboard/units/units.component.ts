import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/service/data.service';
import { Unit } from 'src/app/shared/model/unit';
import { UnitFormComponent } from './unit-form.component';

@Component({ selector: 'app-units', templateUrl: './units.component.html', styleUrls: ['./units.component.css'] })
export class UnitsComponent implements OnInit {
  displayedColumns = ['propertyName','unitNo','floor','type','bedrooms','targetRent','status','actions'];
  dataSource!: MatTableDataSource<Unit>;
  allUnits: Unit[] = []; properties: any[] = []; selectedPropertyId = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataApi: DataService, private dialog: MatDialog, private snack: MatSnackBar) {}
  ngOnInit() {
    this.dataApi.getAllProperty().subscribe(res => { this.properties = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
    this.load();
  }
  load() {
    this.dataApi.getAllUnits().subscribe(res => {
      this.allUnits = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.applyFilter();
    });
  }
  applyFilter() {
    const f = this.selectedPropertyId ? this.allUnits.filter((u: any) => u.propertyId === this.selectedPropertyId) : this.allUnits;
    this.dataSource = new MatTableDataSource(f); this.dataSource.paginator = this.paginator;
  }
  getPropName(id: string) { const p = this.properties.find((x: any) => x.id === id); return p ? (p.p_name || p.name) : '—'; }
  open(row?: any) {
    const cfg = new MatDialogConfig(); cfg.disableClose = true; cfg.width = '620px';
    cfg.data = row ? { ...row, title: 'Edit Unit', buttonName: 'Update', properties: this.properties } : { title: 'Add Unit', buttonName: 'Save', properties: this.properties };
    this.dialog.open(UnitFormComponent, cfg).afterClosed().subscribe(data => {
      if (!data) return;
      if (data.id) { this.dataApi.updateUnit(data); this.snack.open('Updated', 'OK', { duration: 3000 }); }
      else { this.dataApi.addUnit(data); this.snack.open('Unit added', 'OK', { duration: 3000 }); }
    });
  }
  delete(id: string) { if (confirm('Delete unit?')) { this.dataApi.deleteUnit(id); this.snack.open('Deleted', 'OK', { duration: 3000 }); } }
  statusClass(s: string) { const m: any = {'Vacant':'badge-green','Occupied':'badge-blue','Reserved':'badge-amber','Under Maintenance':'badge-orange','Legal Issue':'badge-red','Not Available':'badge-grey'}; return m[s]||'badge-grey'; }
}
