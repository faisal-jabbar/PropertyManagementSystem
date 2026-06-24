export interface Expense {
  id: string;
  ownerId?: string;
  ownerName?: string;
  propertyId?: string;
  propertyName?: string;
  unitId?: string;
  unitNo?: string;
  category: 'Maintenance' | 'Cleaning' | 'Utilities' | 'Security' | 'Marketing' | 'Legal' | 'Management Fee' | 'Other';
  amount: number;
  responsibility: 'Owner' | 'Tenant' | 'Manager' | 'Deducted from Rent';
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  description?: string;
  attachmentUrl?: string;
  createdAt?: any;
}
