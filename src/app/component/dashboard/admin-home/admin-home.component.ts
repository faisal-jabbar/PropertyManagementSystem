import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  totalProperties = 0; totalUnits = 0; vacantUnits = 0; occupiedUnits = 0;
  rentCollected = 0; pendingRent = 0; overdueRent = 0; openTickets = 0;
  expiringLeases: any[] = []; recentTickets: any[] = [];

  constructor(private dataApi: DataService) {}

  ngOnInit() { this.loadStats(); }

  loadStats() {
    this.dataApi.getAllProperty().subscribe(res => { this.totalProperties = res.length; });
    this.dataApi.getAllUnits().subscribe(res => {
      const u = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.totalUnits = u.length;
      this.vacantUnits = u.filter((x: any) => x.status === 'Vacant').length;
      this.occupiedUnits = u.filter((x: any) => x.status === 'Occupied').length;
    });
    this.dataApi.getAllInstallments().subscribe(res => {
      const items = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.rentCollected = items.filter((i: any) => i.status === 'Paid').reduce((s: number, i: any) => s + (i.paidAmount || 0), 0);
      this.pendingRent = items.filter((i: any) => ['Due','Upcoming'].includes(i.status)).reduce((s: number, i: any) => s + ((i.amount||0) - (i.paidAmount||0)), 0);
      this.overdueRent = items.filter((i: any) => i.status === 'Overdue').reduce((s: number, i: any) => s + ((i.amount||0) - (i.paidAmount||0)), 0);
    });
    this.dataApi.getAllTickets().subscribe(res => {
      const t = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.openTickets = t.filter((x: any) => !['Closed','Rejected'].includes(x.status)).length;
      this.recentTickets = t.slice(0, 5);
    });
    this.dataApi.getAllLeases().subscribe(res => {
      const today = new Date(); const in90 = new Date(); in90.setDate(today.getDate() + 90);
      const leases = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; });
      this.expiringLeases = leases.filter((l: any) => {
        const end = new Date(l.endDate);
        return l.status === 'Active' && end >= today && end <= in90;
      }).sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()).slice(0, 5);
    });
  }

  fmt(v: number) { return 'SAR ' + (v||0).toLocaleString(); }
  daysLeft(d: string) { return Math.ceil((new Date(d).getTime() - Date.now()) / 86400000); }
}
