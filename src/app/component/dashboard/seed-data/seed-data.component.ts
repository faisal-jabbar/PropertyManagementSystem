import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';

interface SeedStep { label: string; status: 'pending' | 'running' | 'done' | 'error'; count?: number; }

@Component({
  selector: 'app-seed-data',
  templateUrl: './seed-data.component.html',
  styleUrls: ['./seed-data.component.css']
})
export class SeedDataComponent {
  seeding = false;
  done = false;
  steps: SeedStep[] = [];

  collections = [
    { name: 'Owners',              icon: 'people',        color: '#1565c0' },
    { name: 'Properties',          icon: 'home_work',     color: '#283593' },
    { name: 'Units',               icon: 'domain',        color: '#00695c' },
    { name: 'Tenants',             icon: 'person_pin',    color: '#4a148c' },
    { name: 'Leases',              icon: 'description',   color: '#e65100' },
    { name: 'Rent Installments',   icon: 'payments',      color: '#2e7d32' },
    { name: 'Maintenance Tickets', icon: 'construction',  color: '#c62828' },
    { name: 'Expenses',            icon: 'receipt_long',  color: '#f57f17' },
    { name: 'Owner Statements',    icon: 'summarize',     color: '#00838f' },
  ];

  // We'll keep IDs so later collections can reference them
  private ownerIds: string[] = [];
  private propertyIds: string[] = [];
  private unitIds: string[] = [];
  private tenantIds: string[] = [];
  private leaseIds: string[] = [];

  constructor(private dataApi: DataService) {}

  async seedAll() {
    this.seeding = true;
    this.done = false;
    this.steps = [];

    try {
      await this.seedOwners();
      await this.seedProperties();
      await this.seedUnits();
      await this.seedTenants();
      await this.seedLeases();
      await this.seedRentInstallments();
      await this.seedMaintenanceTickets();
      await this.seedExpenses();
      await this.seedStatements();
      await this.seedEnquiries();
      this.done = true;
    } catch (e) {
      console.error('Seed error', e);
    }
    this.seeding = false;
  }

  private log(label: string): number {
    this.steps.push({ label, status: 'running' });
    return this.steps.length - 1;
  }
  private ok(i: number, count: number) { this.steps[i].status = 'done'; this.steps[i].count = count; }
  private fail(i: number) { this.steps[i].status = 'error'; }

  private async seedOwners() {
    const i = this.log('Seeding Owners…');
    const owners = [
      { name: 'Abdullah Al-Rashidi',  email: 'a.rashidi@propmanage.sa',  mobile: '+966501111001', idNumber: 'SA1001001001', bankDetails: 'Al Rajhi Bank — IBAN SA03 8000 0000 6080 1016 7519', agreementDate: '2024-01-10', managementFee: 8,  approvalThreshold: 5000,  status: 'Active', notes: 'Prefers WhatsApp communication' },
      { name: 'Fatimah Al-Zahrani',   email: 'f.zahrani@propmanage.sa',  mobile: '+966502222002', idNumber: 'SA1002002002', bankDetails: 'SNB — IBAN SA56 1000 0000 1234 5678 9012',          agreementDate: '2024-02-15', managementFee: 10, approvalThreshold: 3000,  status: 'Active', notes: 'Has power of attorney for 2 extra plots' },
      { name: 'Khalid Al-Dossari',    email: 'k.dossari@propmanage.sa',  mobile: '+966503333003', idNumber: 'SA1003003003', bankDetails: 'Riyad Bank — IBAN SA44 2000 0000 9876 5432 1098',    agreementDate: '2024-03-01', managementFee: 12, approvalThreshold: 10000, status: 'Active', notes: 'Investor — expects monthly reports by 5th' },
      { name: 'Noura Al-Otaibi',      email: 'n.otaibi@propmanage.sa',   mobile: '+966504444004', idNumber: 'SA1004004004', bankDetails: 'BSF — IBAN SA28 5500 0000 5500 1122 3344',           agreementDate: '2023-11-20', managementFee: 9,  approvalThreshold: 2000,  status: 'Active', notes: 'Inherited properties — legal review pending' },
      { name: 'Sultan Al-Ghamdi',     email: 's.ghamdi@propmanage.sa',   mobile: '+966505555005', idNumber: 'SA1005005005', bankDetails: 'ANB — IBAN SA36 0500 0000 4321 8765 2109',           agreementDate: '2024-04-05', managementFee: 7,  approvalThreshold: 8000,  status: 'Active', notes: 'Commercial portfolio — strict SLA required' },
    ];
    try {
      for (const o of owners) {
        const ref = await this.dataApi.addOwner({ ...o });
        this.ownerIds.push((ref as any).id);
      }
      this.ok(i, owners.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedProperties() {
    const i = this.log('Seeding Properties…');
    const properties = [
      { p_name: 'Al-Nakheel Residence',   p_address: 'King Fahd Road, Al-Nakheel, Riyadh',       p_amount: 4500000, p_type: 'Residential',  status: 'Active', ownerId: this.ownerIds[0], ownerName: 'Abdullah Al-Rashidi',  totalUnits: 12 },
      { p_name: 'Olaya Business Tower',   p_address: 'Olaya Street, Al-Olaya, Riyadh',            p_amount: 9800000, p_type: 'Commercial',   status: 'Active', ownerId: this.ownerIds[1], ownerName: 'Fatimah Al-Zahrani',   totalUnits: 8  },
      { p_name: 'Al-Malqa Villas',        p_address: 'Imam Saud Road, Al-Malqa, Riyadh',          p_amount: 7200000, p_type: 'Villa',        status: 'Active', ownerId: this.ownerIds[2], ownerName: 'Khalid Al-Dossari',    totalUnits: 5  },
      { p_name: 'Panorama Garden Suites', p_address: 'Prince Sultan Road, Al-Rawdah, Jeddah',     p_amount: 3100000, p_type: 'Residential',  status: 'Active', ownerId: this.ownerIds[3], ownerName: 'Noura Al-Otaibi',      totalUnits: 20 },
      { p_name: 'Al-Waha Warehouse Park', p_address: 'Industrial City, 2nd Ring Road, Riyadh',    p_amount: 6400000, p_type: 'Industrial',   status: 'Active', ownerId: this.ownerIds[4], ownerName: 'Sultan Al-Ghamdi',     totalUnits: 6  },
    ];
    try {
      for (const p of properties) {
        const ref = await this.dataApi.addproperty({ ...p });
        this.propertyIds.push((ref as any).id);
      }
      this.ok(i, properties.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedUnits() {
    const i = this.log('Seeding Units…');
    const units = [
      { propertyId: this.propertyIds[0], propertyName: 'Al-Nakheel Residence',   unitNo: 'A-101', floor: '1', type: '2 BHK',      bedrooms: 2, bathrooms: 2, targetRent: 28000,  status: 'Occupied'          },
      { propertyId: this.propertyIds[1], propertyName: 'Olaya Business Tower',   unitNo: 'G-01',  floor: 'G', type: 'Commercial', bedrooms: 0, bathrooms: 1, targetRent: 95000,  status: 'Occupied'          },
      { propertyId: this.propertyIds[2], propertyName: 'Al-Malqa Villas',        unitNo: 'V-03',  floor: 'G', type: 'Villa',      bedrooms: 5, bathrooms: 4, targetRent: 145000, status: 'Occupied'          },
      { propertyId: this.propertyIds[3], propertyName: 'Panorama Garden Suites', unitNo: 'B-205', floor: '2', type: 'Studio',     bedrooms: 0, bathrooms: 1, targetRent: 14000,  status: 'Vacant'            },
      { propertyId: this.propertyIds[4], propertyName: 'Al-Waha Warehouse Park', unitNo: 'WH-2',  floor: 'G', type: 'Warehouse',  bedrooms: 0, bathrooms: 2, targetRent: 72000,  status: 'Under Maintenance' },
    ];
    try {
      for (const u of units) {
        const ref = await this.dataApi.addUnit({ ...u });
        this.unitIds.push((ref as any).id);
      }
      this.ok(i, units.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedTenants() {
    const i = this.log('Seeding Tenants…');
    const tenants = [
      { name: 'Mohammed Al-Harbi',   email: 'm.harbi@gmail.com',    mobile: '+966511100001', idNumber: 'TN2001001001', employer: 'Saudi Aramco',           emergencyContact: '+966511200001', status: 'Active' },
      { name: 'Lina Mansour',        email: 'lina.m@outlook.com',   mobile: '+966512200002', idNumber: 'TN2002002002', employer: 'KPMG Saudi Arabia',      emergencyContact: '+966512300002', status: 'Active' },
      { name: 'Ahmed Fouad Al-Sisi', email: 'a.sisi@hotmail.com',   mobile: '+966513300003', idNumber: 'TN2003003003', employer: 'Al Rajhi Capital',       emergencyContact: '+966513400003', status: 'Active' },
      { name: 'Sara Al-Mutairi',     email: 's.mutairi@gmail.com',  mobile: '+966514400004', idNumber: 'TN2004004004', employer: 'Ministry of Education',  emergencyContact: '+966514500004', status: 'Active' },
      { name: 'Omar Khalil Hassan',  email: 'o.hassan@yahoo.com',   mobile: '+966515500005', idNumber: 'TN2005005005', employer: 'STC Telecom',            emergencyContact: '+966515600005', status: 'Active' },
    ];
    try {
      for (const t of tenants) {
        const ref = await this.dataApi.addTenant({ ...t });
        this.tenantIds.push((ref as any).id);
      }
      this.ok(i, tenants.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedLeases() {
    const i = this.log('Seeding Leases…');
    const leases = [
      { tenantId: this.tenantIds[0], tenantName: 'Mohammed Al-Harbi',   unitId: this.unitIds[0], unitNo: 'A-101', propertyId: this.propertyIds[0], propertyName: 'Al-Nakheel Residence',   startDate: '2024-01-01', endDate: '2024-12-31', rentAmount: 28000,  deposit: 28000,  frequency: 'Monthly',   ejarRef: 'EJR-2024-10001', status: 'Active', notes: '' },
      { tenantId: this.tenantIds[1], tenantName: 'Lina Mansour',        unitId: this.unitIds[1], unitNo: 'G-01',  propertyId: this.propertyIds[1], propertyName: 'Olaya Business Tower',   startDate: '2024-03-01', endDate: '2025-02-28', rentAmount: 95000,  deposit: 95000,  frequency: 'Quarterly', ejarRef: 'EJR-2024-10002', status: 'Active', notes: 'Commercial use — IT services firm' },
      { tenantId: this.tenantIds[2], tenantName: 'Ahmed Fouad Al-Sisi', unitId: this.unitIds[2], unitNo: 'V-03',  propertyId: this.propertyIds[2], propertyName: 'Al-Malqa Villas',        startDate: '2024-02-01', endDate: '2025-01-31', rentAmount: 145000, deposit: 145000, frequency: 'Annual',    ejarRef: 'EJR-2024-10003', status: 'Active', notes: 'Villa fully furnished' },
      { tenantId: this.tenantIds[3], tenantName: 'Sara Al-Mutairi',     unitId: this.unitIds[3], unitNo: 'B-205', propertyId: this.propertyIds[3], propertyName: 'Panorama Garden Suites', startDate: '2023-09-01', endDate: '2024-08-31', rentAmount: 14000,  deposit: 7000,   frequency: 'Monthly',   ejarRef: 'EJR-2023-10004', status: 'Expired', notes: 'Renewal pending' },
      { tenantId: this.tenantIds[4], tenantName: 'Omar Khalil Hassan',  unitId: this.unitIds[4], unitNo: 'WH-2',  propertyId: this.propertyIds[4], propertyName: 'Al-Waha Warehouse Park', startDate: '2024-04-01', endDate: '2025-03-31', rentAmount: 72000,  deposit: 36000,  frequency: 'Quarterly', ejarRef: 'EJR-2024-10005', status: 'Active', notes: 'Logistics operations — 24hr access' },
    ];
    try {
      for (const l of leases) {
        const ref = await this.dataApi.addLease({ ...l, createdAt: new Date().toISOString() });
        this.leaseIds.push((ref as any).id);
      }
      this.ok(i, leases.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedRentInstallments() {
    const i = this.log('Seeding Rent Installments…');
    const installments = [
      { leaseId: this.leaseIds[0], tenantId: this.tenantIds[0], tenantName: 'Mohammed Al-Harbi',   unitId: this.unitIds[0], unitNo: 'A-101', propertyId: this.propertyIds[0], dueDate: '2024-06-01', amount: 28000,  paidAmount: 28000,  status: 'Paid',         verifiedBy: 'admin@propmanage.sa', verifiedAt: '2024-06-02T10:30:00Z' },
      { leaseId: this.leaseIds[1], tenantId: this.tenantIds[1], tenantName: 'Lina Mansour',        unitId: this.unitIds[1], unitNo: 'G-01',  propertyId: this.propertyIds[1], dueDate: '2024-06-01', amount: 95000,  paidAmount: 95000,  status: 'Paid',         verifiedBy: 'admin@propmanage.sa', verifiedAt: '2024-06-05T09:00:00Z' },
      { leaseId: this.leaseIds[2], tenantId: this.tenantIds[2], tenantName: 'Ahmed Fouad Al-Sisi', unitId: this.unitIds[2], unitNo: 'V-03',  propertyId: this.propertyIds[2], dueDate: '2024-02-01', amount: 145000, paidAmount: 145000, status: 'Paid',         verifiedBy: 'admin@propmanage.sa', verifiedAt: '2024-02-01T12:00:00Z' },
      { leaseId: this.leaseIds[3], tenantId: this.tenantIds[3], tenantName: 'Sara Al-Mutairi',     unitId: this.unitIds[3], unitNo: 'B-205', propertyId: this.propertyIds[3], dueDate: '2024-07-01', amount: 14000,  paidAmount: 0,      status: 'Overdue',      verifiedBy: '',                    verifiedAt: '' },
      { leaseId: this.leaseIds[4], tenantId: this.tenantIds[4], tenantName: 'Omar Khalil Hassan',  unitId: this.unitIds[4], unitNo: 'WH-2',  propertyId: this.propertyIds[4], dueDate: '2024-07-01', amount: 72000,  paidAmount: 36000,  status: 'Partially Paid', verifiedBy: '',                  verifiedAt: '' },
    ];
    try {
      for (const r of installments) {
        await this.dataApi.addRentInstallment({ ...r, createdAt: new Date().toISOString() });
      }
      this.ok(i, installments.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedMaintenanceTickets() {
    const i = this.log('Seeding Maintenance Tickets…');
    const tickets = [
      { unitId: this.unitIds[0], unitNo: 'A-101', propertyId: this.propertyIds[0], tenantId: this.tenantIds[0], tenantName: 'Mohammed Al-Harbi',   ticketNo: 'TKT-10001', category: 'Plumbing',    priority: 'Urgent', status: 'In Progress',    assignedVendorName: 'Al-Salam Plumbing Co.',  assignedVendorId: '', costEstimate: 850,   description: 'Kitchen sink leaking severely — water pooling under cabinet.', statusHistory: [{ status: 'New', changedBy: 'm.harbi@gmail.com', changedAt: '2024-06-10T08:00:00Z' }, { status: 'In Progress', changedBy: 'admin@propmanage.sa', changedAt: '2024-06-10T10:00:00Z' }] },
      { unitId: this.unitIds[1], unitNo: 'G-01',  propertyId: this.propertyIds[1], tenantId: this.tenantIds[1], tenantName: 'Lina Mansour',        ticketNo: 'TKT-10002', category: 'HVAC/AC',    priority: 'High',   status: 'Completed',      assignedVendorName: 'Cool Zone HVAC LLC',      assignedVendorId: '', costEstimate: 2200,  description: 'Central AC unit not cooling — office temperature exceeding 35°C.', statusHistory: [{ status: 'New', changedBy: 'lina.m@outlook.com', changedAt: '2024-05-20T09:00:00Z' }, { status: 'Completed', changedBy: 'admin@propmanage.sa', changedAt: '2024-05-22T14:00:00Z' }] },
      { unitId: this.unitIds[2], unitNo: 'V-03',  propertyId: this.propertyIds[2], tenantId: this.tenantIds[2], tenantName: 'Ahmed Fouad Al-Sisi', ticketNo: 'TKT-10003', category: 'Electrical',  priority: 'High',   status: 'Vendor Assigned', assignedVendorName: 'Bright Spark Electricals', assignedVendorId: '', costEstimate: 1500,  description: 'Frequent power tripping in master bedroom — possible wiring fault.', statusHistory: [{ status: 'New', changedBy: 'a.sisi@hotmail.com', changedAt: '2024-06-12T07:30:00Z' }, { status: 'Vendor Assigned', changedBy: 'admin@propmanage.sa', changedAt: '2024-06-12T11:00:00Z' }] },
      { unitId: this.unitIds[3], unitNo: 'B-205', propertyId: this.propertyIds[3], tenantId: this.tenantIds[3], tenantName: 'Sara Al-Mutairi',     ticketNo: 'TKT-10004', category: 'Painting',    priority: 'Low',    status: 'New',             assignedVendorName: '',                        assignedVendorId: '', costEstimate: 0,     description: 'Living room walls need repainting — peeling paint near windows.', statusHistory: [{ status: 'New', changedBy: 's.mutairi@gmail.com', changedAt: '2024-06-14T16:00:00Z' }] },
      { unitId: this.unitIds[4], unitNo: 'WH-2',  propertyId: this.propertyIds[4], tenantId: this.tenantIds[4], tenantName: 'Omar Khalil Hassan',  ticketNo: 'TKT-10005', category: 'Security',    priority: 'Medium', status: 'Quote Received',  assignedVendorName: 'SecureMax Systems',        assignedVendorId: '', costEstimate: 3800,  description: 'Warehouse CCTV cameras offline — 3 out of 8 cameras not working.', statusHistory: [{ status: 'New', changedBy: 'o.hassan@yahoo.com', changedAt: '2024-06-08T10:00:00Z' }, { status: 'Quote Received', changedBy: 'admin@propmanage.sa', changedAt: '2024-06-09T09:00:00Z' }] },
    ];
    try {
      for (const t of tickets) {
        await this.dataApi.addTicket({ ...t, createdAt: new Date().toISOString() });
      }
      this.ok(i, tickets.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedExpenses() {
    const i = this.log('Seeding Expenses…');
    const expenses = [
      { ownerId: this.ownerIds[0], ownerName: 'Abdullah Al-Rashidi', propertyId: this.propertyIds[0], propertyName: 'Al-Nakheel Residence',   category: 'Maintenance',  amount: 850,   responsibility: 'Owner',   date: '2024-06-10', description: 'Plumbing repair — kitchen sink A-101',           status: 'Approved' },
      { ownerId: this.ownerIds[1], ownerName: 'Fatimah Al-Zahrani',  propertyId: this.propertyIds[1], propertyName: 'Olaya Business Tower',   category: 'HVAC/AC',      amount: 2200,  responsibility: 'Owner',   date: '2024-05-22', description: 'AC unit repair and gas refill — G-01',           status: 'Approved' },
      { ownerId: this.ownerIds[2], ownerName: 'Khalid Al-Dossari',   propertyId: this.propertyIds[2], propertyName: 'Al-Malqa Villas',        category: 'Utilities',    amount: 1200,  responsibility: 'Tenant',  date: '2024-06-01', description: 'Quarterly utility bill — water & electricity V-03', status: 'Approved' },
      { ownerId: this.ownerIds[3], ownerName: 'Noura Al-Otaibi',     propertyId: this.propertyIds[3], propertyName: 'Panorama Garden Suites', category: 'Legal',        amount: 4500,  responsibility: 'Owner',   date: '2024-04-15', description: 'Legal consultation — lease renewal documentation', status: 'Pending'  },
      { ownerId: this.ownerIds[4], ownerName: 'Sultan Al-Ghamdi',    propertyId: this.propertyIds[4], propertyName: 'Al-Waha Warehouse Park', category: 'Security',     amount: 3800,  responsibility: 'Owner',   date: '2024-06-09', description: 'CCTV camera replacement — WH-2 (3 units)',       status: 'Pending'  },
    ];
    try {
      for (const e of expenses) {
        await this.dataApi.addExpense({ ...e, createdAt: new Date().toISOString() });
      }
      this.ok(i, expenses.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedStatements() {
    const i = this.log('Seeding Owner Statements…');
    const statements = [
      { ownerId: this.ownerIds[0], ownerName: 'Abdullah Al-Rashidi', periodStart: '2024-05-01', periodEnd: '2024-05-31', rentTotal: 28000,  expenseTotal: 0,    feeTotal: 2240,  payoutAmount: 25760,  status: 'Paid',    payoutBankRef: 'TXN-RAJ-202405-001', payoutDate: '2024-06-05', notes: 'May 2024 statement — single unit' },
      { ownerId: this.ownerIds[1], ownerName: 'Fatimah Al-Zahrani',  periodStart: '2024-05-01', periodEnd: '2024-05-31', rentTotal: 95000,  expenseTotal: 2200, feeTotal: 9500,  payoutAmount: 83300,  status: 'Approved', payoutBankRef: '',                  payoutDate: '',           notes: 'May 2024 — deducted AC repair cost' },
      { ownerId: this.ownerIds[2], ownerName: 'Khalid Al-Dossari',   periodStart: '2024-01-01', periodEnd: '2024-06-30', rentTotal: 145000, expenseTotal: 1200, feeTotal: 17400, payoutAmount: 126400, status: 'Sent',    payoutBankRef: '',                  payoutDate: '',           notes: 'H1 2024 annual lease statement' },
      { ownerId: this.ownerIds[3], ownerName: 'Noura Al-Otaibi',     periodStart: '2024-05-01', periodEnd: '2024-05-31', rentTotal: 14000,  expenseTotal: 0,    feeTotal: 1260,  payoutAmount: 12740,  status: 'Disputed', payoutBankRef: '',                 payoutDate: '',           notes: 'Owner disputes management fee rate — under review' },
      { ownerId: this.ownerIds[4], ownerName: 'Sultan Al-Ghamdi',    periodStart: '2024-04-01', periodEnd: '2024-06-30', rentTotal: 72000,  expenseTotal: 3800, feeTotal: 5040,  payoutAmount: 63160,  status: 'Draft',   payoutBankRef: '',                  payoutDate: '',           notes: 'Q2 2024 warehouse statement — CCTV expense pending approval' },
    ];
    try {
      for (const s of statements) {
        await this.dataApi.addStatement({ ...s, createdAt: new Date().toISOString() });
      }
      this.ok(i, statements.length);
    } catch (e) { this.fail(i); throw e; }
  }

  private async seedEnquiries() {
    const i = this.log('Seeding Enquiries…');
    const enquiries = [
      { name: 'Youssef Al-Barakati', email: 'y.barakati@gmail.com', mobile: '+966571000001', subject: 'Interested in 3-BHK apartment in Al-Nakheel', message: 'I am looking for a furnished apartment for a family of 4. Budget is SAR 30,000/yr. Available to visit this weekend.',      propertyName: 'Al-Nakheel Residence',   status: 'New',  createdAt: new Date().toISOString() },
      { name: 'Reem Al-Shammari',   email: 'r.shammari@hotmail.com', mobile: '+966572000002', subject: 'Office space inquiry — Olaya Tower',          message: 'We need 200 sqm office space for a fintech startup. Need parking for 10 vehicles. Please share availability and pricing.', propertyName: 'Olaya Business Tower',   status: 'New',  createdAt: new Date().toISOString() },
      { name: 'Tariq Al-Anazi',     email: 't.anazi@yahoo.com',      mobile: '+966573000003', subject: 'Villa rental inquiry — Al-Malqa',             message: 'Looking for a villa for my family. Need at least 4 bedrooms, private pool preferred. When can we schedule a viewing?',     propertyName: 'Al-Malqa Villas',        status: 'Read', createdAt: new Date().toISOString() },
      { name: 'Hana Al-Qurashi',    email: 'h.qurashi@outlook.com',  mobile: '+966574000004', subject: 'Studio availability — Panorama Suites',       message: 'I am a single professional relocating from Dubai. Need a furnished studio near public transport. Is B-205 still available?', propertyName: 'Panorama Garden Suites', status: 'Read', createdAt: new Date().toISOString() },
      { name: 'Faris Al-Qahtani',   email: 'f.qahtani@gmail.com',    mobile: '+966575000005', subject: 'Warehouse space for logistics company',        message: 'We are a 3PL company looking for 500+ sqm warehouse space near Ring Road. Need 24-hour access and truck loading dock.',    propertyName: 'Al-Waha Warehouse Park', status: 'New',  createdAt: new Date().toISOString() },
    ];
    try {
      for (const e of enquiries) {
        await this.dataApi.addenquiry({ ...e });
      }
      this.ok(i, enquiries.length);
    } catch (e) { this.fail(i); throw e; }
  }
}
