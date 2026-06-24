export interface Owner {
  id: string;
  name: string;
  mobile: string;
  email: string;
  idNumber: string;
  bankDetails: string;
  agreementDate: string;
  managementFee: number;
  approvalThreshold: number;
  status: 'Active' | 'Inactive';
  notes?: string;
  createdAt?: any;
}
