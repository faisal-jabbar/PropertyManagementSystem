import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(r => r.matches), shareReplay());
  title = 'Dashboard';

  constructor(private breakpointObserver: BreakpointObserver, public authApi: AuthService) {}

  updateTitle(label: string) { this.title = label; }

  logout() { this.authApi.logout(); }

  get profile() { return this.authApi.getCurrentProfile(); }
  get isAdmin() { return this.authApi.hasRole('super_admin', 'manager', 'finance'); }
  get isOwner() { return this.authApi.hasRole('owner'); }
  get isTenant() { return this.authApi.hasRole('tenant'); }
  get isVendor() { return this.authApi.hasRole('vendor'); }
  get isSuperAdmin() { return this.authApi.hasRole('super_admin'); }
}
