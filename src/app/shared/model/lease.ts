export interface Lease {
  id: string;
  tenantId: string;
  tenantName?: string;
  unitId: string;
  unitNo?: string;
  propertyId?: string;
  propertyName?: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  deposit: number;
  frequency: 'Monthly' | 'Quarterly' | 'Annual';
  status: 'Active' | 'Expired' | 'Terminated' | 'Pending';
  ejarRef?: string;
  notes?: string;
  createdAt?: any;
}
