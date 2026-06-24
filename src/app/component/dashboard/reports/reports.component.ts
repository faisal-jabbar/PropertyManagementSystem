import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';

@Component({ selector: 'app-reports', templateUrl: './reports.component.html', styleUrls: ['./reports.component.css'] })
export class ReportsComponent implements OnInit {
  rentData: any[] = []; overdueData: any[] = []; occupancyData: any[] = []; maintenanceData: any[] = []; activeTab = 0;
  constructor(private dataApi: DataService) {}
  ngOnInit() { this.loadAll(); }
  loadAll() {
    this.dataApi.getAllInstallments().subscribe(res => {
      const all = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.rentData = all.filter((i: any) => i.status==='Paid');
      this.overdueData = all.filter((i: any) => i.status==='Overdue');
    });
    this.dataApi.getAllUnits().subscribe(res => { this.occupancyData = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
    this.dataApi.getAllTickets().subscribe(res => { this.maintenanceData = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); });
  }
  exportCSV(data: any[], filename: string) {
    if (!data.length) { alert('No data to export'); return; }
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(r => keys.map(k => JSON.stringify(r[k]??'')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = filename+'.csv'; a.click(); URL.revokeObjectURL(url);
  }
  get totalCollected() { return this.rentData.reduce((s,i) => s+(i.paidAmount||0), 0); }
  get totalOverdue() { return this.overdueData.reduce((s,i) => s+((i.amount||0)-(i.paidAmount||0)), 0); }
  get vacantCount() { return this.occupancyData.filter((u: any) => u.status==='Vacant').length; }
  get occupiedCount() { return this.occupancyData.filter((u: any) => u.status==='Occupied').length; }
  get openTickets() { return this.maintenanceData.filter((t: any) => !['Closed','Rejected'].includes(t.status)).length; }
}
