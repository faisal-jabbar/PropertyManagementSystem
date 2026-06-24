export interface Tenant {
  id: string;
  name: string;
  mobile: string;
  email: string;
  idNumber: string;
  employer: string;
  emergencyContact: string;
  status: 'Active' | 'Inactive';
  createdAt?: any;
}
