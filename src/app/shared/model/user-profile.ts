export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'super_admin' | 'manager' | 'owner' | 'tenant' | 'vendor' | 'finance';
  mobile?: string;
  status: 'Active' | 'Inactive';
  ownerId?: string;
  tenantId?: string;
  vendorId?: string;
  createdAt?: any;
}
