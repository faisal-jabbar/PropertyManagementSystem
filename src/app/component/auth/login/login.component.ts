import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  showReset = false;
  resetEmail = '';

  constructor(
    private authApi: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.email || !this.password) {
      this.snack.open('Please enter email and password', 'OK', { duration: 3000 }); return;
    }
    this.isLoading = true;
    const profile = await this.authApi.login(this.email, this.password);
    this.isLoading = false;
    if (!profile) {
      this.snack.open('Invalid credentials or account inactive', 'OK', { duration: 3000 }); return;
    }
    const role = profile.role;
    // Route each role to its dedicated home page
    // 'super_admin' → full admin dashboard (same as manager/finance)
    if (role === 'super_admin' || role === 'manager' || role === 'finance') {
      await this.router.navigate(['/dashboard/admin-home']);
    } else if (role === 'owner') {
      await this.router.navigate(['/dashboard/owner-home']);
    } else if (role === 'tenant') {
      await this.router.navigate(['/dashboard/tenant-home']);
    } else if (role === 'vendor') {
      await this.router.navigate(['/dashboard/vendor-home']);
    } else {
      // Fallback — unknown role still goes to admin-home
      await this.router.navigate(['/dashboard/admin-home']);
    }
    // Force reload so sidebar role guards re-evaluate
    location.reload();
  }

  async sendReset() {
    if (!this.resetEmail) return;
    await this.authApi.resetPassword(this.resetEmail);
    this.snack.open('Password reset email sent!', 'OK', { duration: 4000 });
    this.showReset = false;
  }
}