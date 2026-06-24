import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  name = ''; email = ''; mobile = ''; password = ''; confirmPassword = '';
  role = 'tenant';
  isLoading = false;
  showPassword = false;
  showConfirm  = false;

  /**
   * Role options for the signup dropdown.
   *
   * ⚠️  PRODUCTION NOTE:
   * The 'super_admin' option should be REMOVED or hidden behind an invite
   * token / admin-only page before going live.  Leaving it here for
   * development/demo convenience only.
   */
  roles = [
    // ── Admin ──────────────────────────────────────────────────────────────
    { value: 'super_admin', label: '⭐ Admin / Super Admin',    group: 'Administration', devOnly: true },

    // ── Staff ───────────────────────────────────────────────────────────────
    { value: 'manager',     label: 'Property Manager',          group: 'Staff',          devOnly: false },
    { value: 'finance',     label: 'Finance / Accountant',      group: 'Staff',          devOnly: false },

    // ── External ─────────────────────────────────────────────────────────────
    { value: 'owner',       label: 'Property Owner',            group: 'External',       devOnly: false },
    { value: 'tenant',      label: 'Tenant',                    group: 'External',       devOnly: false },
    { value: 'vendor',      label: 'Vendor / Technician',       group: 'External',       devOnly: false },
  ];

  // Expose groups so HTML can iterate them
  groups = ['Administration', 'Staff', 'External'];

  rolesInGroup(group: string) {
    return this.roles.filter(r => r.group === group);
  }

  get selectedRoleLabel() {
    return this.roles.find(r => r.value === this.role)?.label ?? '';
  }

  constructor(public authApi: AuthService) {}

  async register() {
    if (!this.name || !this.email || !this.mobile || !this.password) {
      alert('Please fill in all required fields.'); return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.'); return;
    }
    if (this.password.length < 6) {
      alert('Password must be at least 6 characters.'); return;
    }
    this.isLoading = true;
    // role value (e.g. 'super_admin') is stored as-is in Firestore
    await this.authApi.signup(this.email, this.password, this.name, this.role, this.mobile);
    this.isLoading = false;
  }
}
