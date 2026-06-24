export interface MaintenanceTicket {
  id: string;
  ticketNo?: string;
  unitId: string;
  unitNo?: string;
  propertyId?: string;
  propertyName?: string;
  tenantId?: string;
  tenantName?: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  status: 'New' | 'Under Review' | 'Vendor Assigned' | 'Quote Received' | 'Waiting Approval' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected' | 'Closed';
  assignedVendorId?: string;
  assignedVendorName?: string;
  costEstimate?: number;
  invoiceUrl?: string;
  photoUrl?: string;
  statusHistory?: { status: string; changedBy: string; changedAt: string; notes?: string }[];
  notes?: string;
  createdAt?: any;
}
