import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  constructor(private dataApi: DataService, private authApi: AuthService) {}

  log(action: string, entityType: string, entityId: string, oldValue?: any, newValue?: any) {
    const profile = this.authApi.getCurrentProfile();
    return this.dataApi.addAuditLog({
      userId: profile?.uid || 'system',
      userEmail: profile?.email || '',
      action, entityType, entityId,
      oldValue: oldValue || null,
      newValue: newValue || null,
      timestamp: new Date().toISOString()
    });
  }
}
