import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-tenant-home',
  templateUrl: './tenant-home.component.html',
  styleUrls: ['./tenant-home.component.css']
})
export class TenantHomeComponent implements OnInit {
  totalDue = 0; overdueCount = 0; paidCount = 0; openTickets = 0;
  constructor(private dataApi: DataService, private authApi: AuthService) {}
  ngOnInit() {
    const p = this.authApi.getCurrentProfile(); if (!p) return;
    this.dataApi.getAllInstallments().subscribe(res => {
      const all = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }).filter((i: any) => i.tenantId===p.uid);
      this.totalDue = all.filter((i: any) => ['Due','Overdue'].includes(i.status)).reduce((s: number, i: any) => s+((i.amount||0)-(i.paidAmount||0)), 0);
      this.overdueCount = all.filter((i: any) => i.status==='Overdue').length;
      this.paidCount = all.filter((i: any) => i.status==='Paid').length;
    });
    this.dataApi.getTicketsByTenant(p.uid).subscribe(res => {
      this.openTickets = res.filter((e: any) => { const d = e.payload.doc.data(); return !['Closed','Rejected'].includes(d.status); }).length;
    });
  }
}
