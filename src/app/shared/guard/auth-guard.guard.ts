import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  Router, RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardGuard implements CanActivate {

  constructor(private authApi: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Step 1: Must be logged in
    if (!this.authApi.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Step 2: Must have a valid profile stored
    const profile = this.authApi.getCurrentProfile();
    if (!profile) {
      this.authApi.logout();
      return false;
    }

    // Step 3: Check route-level role restriction (optional)
    // If a route has data: { roles: ['super_admin', 'manager'] },
    // only those roles can access it.
    const allowedRoles: string[] | undefined = route.data?.['roles'];
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.includes(profile.role);
      if (!hasAccess) {
        // Redirect to their own home page instead of login
        this.redirectToHome(profile.role);
        return false;
      }
    }

    return true;
  }

  /**
   * Redirect user to their role-appropriate home page when they try
   * to access a restricted route.
   */
  private redirectToHome(role: string) {
    // super_admin, manager, finance → admin dashboard
    if (['super_admin', 'manager', 'finance'].includes(role)) {
      this.router.navigate(['/dashboard/admin-home']);
    } else if (role === 'owner') {
      this.router.navigate(['/dashboard/owner-home']);
    } else if (role === 'tenant') {
      this.router.navigate(['/dashboard/tenant-home']);
    } else if (role === 'vendor') {
      this.router.navigate(['/dashboard/vendor-home']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
