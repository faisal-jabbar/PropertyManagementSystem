import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-vendor-home',
  templateUrl: './vendor-home.component.html',
  styleUrls: ['./vendor-home.component.css']
})
export class VendorHomeComponent implements OnInit {
  tickets: any[] = [];
  cols = ['ticketNo','unitNo','category','priority','status'];
  constructor(private dataApi: DataService, private authApi: AuthService) {}
  ngOnInit() {
    const p = this.authApi.getCurrentProfile();
    if (p) { this.dataApi.getTicketsByVendor(p.uid).subscribe(res => { this.tickets = res.map((e: any) => { const d = e.payload.doc.data(); d.id = e.payload.doc.id; return d; }); }); }
  }
}
