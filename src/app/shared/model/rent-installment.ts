export interface RentInstallment {
  id: string;
  leaseId: string;
  tenantId?: string;
  tenantName?: string;
  unitId?: string;
  unitNo?: string;
  propertyId?: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Upcoming' | 'Due' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Disputed' | 'Waived';
  verifiedBy?: string;
  verifiedAt?: string;
  proofUrl?: string;
  notes?: string;
  createdAt?: any;
}
