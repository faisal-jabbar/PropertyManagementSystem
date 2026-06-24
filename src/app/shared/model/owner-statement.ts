export interface OwnerStatement {
  id: string;
  ownerId: string;
  ownerName?: string;
  periodStart: string;
  periodEnd: string;
  rentTotal: number;
  expenseTotal: number;
  feeTotal: number;
  payoutAmount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Disputed' | 'Paid' | 'Closed';
  notes?: string;
  payoutDate?: string;
  payoutBankRef?: string;
  payoutProofUrl?: string;
  createdAt?: any;
}
