import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserProfile } from '../model/user-profile';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  login(email: string, password: string): Promise<UserProfile | null> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then(async result => {
        if (result.user) {
          const uid = result.user.uid;
          let profile: UserProfile | null = null;

          // Try up to 3 times — first attempt may fail due to security rules
          // requiring the session to be fully established
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const doc = await this.firestore.doc<UserProfile>(`users/${uid}`).get().toPromise();
              const data = doc?.data();
              if (data) { profile = data as UserProfile; break; }
            } catch (err: any) {
              console.warn(`Profile read attempt ${attempt} failed:`, err?.message || err);
              if (attempt < 3) await new Promise(r => setTimeout(r, 600));
            }
          }

          if (!profile) {
            console.error('Could not read user profile from Firestore after 3 attempts.');
            await this.auth.signOut();
            return null;
          }

          if (profile.status === 'Inactive') {
            await this.auth.signOut();
            return null;
          }

          localStorage.setItem('user', JSON.stringify({ uid, email: result.user.email }));
          localStorage.setItem('userProfile', JSON.stringify(profile));
          return profile;
        }
        return null;
      })
      .catch(error => { console.error('Login error:', error); return null; });
  }


  async signup(email: string, password: string, name: string, role: string, mobile: string): Promise<boolean> {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(email, password);
      if (result.user) {
        /**
         * Allowed role values stored in Firestore:
         *   'super_admin' | 'manager' | 'finance' | 'owner' | 'tenant' | 'vendor'
         *
         * ⚠️  PRODUCTION: Remove 'super_admin' from the signup UI dropdown
         *    and add server-side validation so it cannot be self-assigned.
         */
        const profile: UserProfile = {
          uid: result.user.uid,
          email,
          name,
          mobile,
          role: role as any,   // stored exactly as chosen (e.g. 'super_admin')
          status: 'Active',
          createdAt: new Date().toISOString()
        };
        await this.firestore.doc(`users/${result.user.uid}`).set(profile);
        this.openSnackBar('Account created successfully! Please log in.', 'OK');
        await this.router.navigate(['/login']);
        return true;
      }
      return false;
    } catch (error: any) {
      window.alert(error.message);
      return false;
    }
  }

  async logout() {
    await this.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isSeller');
    await this.router.navigate(['/login']);
    location.reload();
  }

  isUserLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return user !== null && user !== 'null';
  }

  getCurrentProfile(): UserProfile | null {
    const raw = localStorage.getItem('userProfile');
    return raw ? JSON.parse(raw) : null;
  }

  getCurrentUid(): string {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw).uid : '';
  }

  hasRole(...roles: string[]): boolean {
    const profile = this.getCurrentProfile();
    return profile ? roles.includes(profile.role) : false;
  }

  // ── Role helpers ────────────────────────────────────────────────────────
  // 'super_admin' has full admin privileges + extra powers (user mgmt, seed)
  isAdmin(): boolean      { return this.hasRole('super_admin', 'manager', 'finance'); }
  isSuperAdmin(): boolean { return this.hasRole('super_admin'); }
  isOwner(): boolean      { return this.hasRole('owner'); }
  isTenant(): boolean     { return this.hasRole('tenant'); }
  isVendor(): boolean     { return this.hasRole('vendor'); }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  async resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }
}