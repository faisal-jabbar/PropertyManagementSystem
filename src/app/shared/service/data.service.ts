import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────
  newId() { return this.afs.createId(); }

  uploadFile(path: string, file: File): Observable<string> {
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);
    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL().subscribe(url => {
          observer.next(url); observer.complete();
        }))
      ).subscribe();
    });
  }

  // ─── Properties ─────────────────────────────────────────────────────────────
  addproperty(p: any) { p.id = this.afs.createId(); return this.afs.collection('Property/').add(p); }
  getAllProperty() { return this.afs.collection('Property/').snapshotChanges(); }
  updateProperty(p: any) { return this.afs.doc('Property/' + p.id).update(p); }
  deleteProperty(id: string) { return this.afs.doc('Property/' + id).delete(); }
  getPropertyById(id: string) { return this.afs.doc('Property/' + id).valueChanges(); }

  // ─── Units ───────────────────────────────────────────────────────────────────
  addUnit(unit: any) { unit.id = this.afs.createId(); return this.afs.collection('units').add(unit); }
  getUnitsByProperty(propertyId: string) { return this.afs.collection('units', r => r.where('propertyId', '==', propertyId)).snapshotChanges(); }
  getAllUnits() { return this.afs.collection('units').snapshotChanges(); }
  updateUnit(unit: any) { return this.afs.doc('units/' + unit.id).update(unit); }
  deleteUnit(id: string) { return this.afs.doc('units/' + id).delete(); }
  getUnitById(id: string) { return this.afs.doc('units/' + id).valueChanges(); }

  // ─── Owners ─────────────────────────────────────────────────────────────────
  addOwner(o: any) { o.id = this.afs.createId(); return this.afs.collection('owners').add(o); }
  getAllOwners() { return this.afs.collection('owners').snapshotChanges(); }
  updateOwner(o: any) { return this.afs.doc('owners/' + o.id).update(o); }
  deleteOwner(id: string) { return this.afs.doc('owners/' + id).delete(); }
  getOwnerById(id: string) { return this.afs.doc('owners/' + id).valueChanges(); }

  // ─── Tenants ─────────────────────────────────────────────────────────────────
  addTenant(t: any) { t.id = this.afs.createId(); return this.afs.collection('tenants').add(t); }
  getAllTenants() { return this.afs.collection('tenants').snapshotChanges(); }
  updateTenant(t: any) { return this.afs.doc('tenants/' + t.id).update(t); }
  deleteTenant(id: string) { return this.afs.doc('tenants/' + id).delete(); }
  getTenantById(id: string) { return this.afs.doc('tenants/' + id).valueChanges(); }

  // ─── Leases ─────────────────────────────────────────────────────────────────
  addLease(l: any) { l.id = this.afs.createId(); return this.afs.collection('leases').add(l); }
  getAllLeases() { return this.afs.collection('leases').snapshotChanges(); }
  getLeasesByTenant(tenantId: string) { return this.afs.collection('leases', r => r.where('tenantId', '==', tenantId)).snapshotChanges(); }
  getLeasesByUnit(unitId: string) { return this.afs.collection('leases', r => r.where('unitId', '==', unitId).where('status', '==', 'Active')).snapshotChanges(); }
  updateLease(l: any) { return this.afs.doc('leases/' + l.id).update(l); }
  deleteLease(id: string) { return this.afs.doc('leases/' + id).delete(); }

  // ─── Rent Installments ───────────────────────────────────────────────────────
  addRentInstallment(r: any) { r.id = this.afs.createId(); return this.afs.collection('rent_installments').add(r); }
  getAllInstallments() { return this.afs.collection('rent_installments', ref => ref.orderBy('dueDate')).snapshotChanges(); }
  getInstallmentsByLease(leaseId: string) { return this.afs.collection('rent_installments', r => r.where('leaseId', '==', leaseId)).snapshotChanges(); }
  updateInstallment(r: any) { return this.afs.doc('rent_installments/' + r.id).update(r); }

  // ─── Maintenance Tickets ─────────────────────────────────────────────────────
  addTicket(t: any) { t.id = this.afs.createId(); return this.afs.collection('maintenance_tickets').add(t); }
  getAllTickets() { return this.afs.collection('maintenance_tickets', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges(); }
  getTicketsByUnit(unitId: string) { return this.afs.collection('maintenance_tickets', r => r.where('unitId', '==', unitId)).snapshotChanges(); }
  getTicketsByVendor(vendorId: string) { return this.afs.collection('maintenance_tickets', r => r.where('assignedVendorId', '==', vendorId)).snapshotChanges(); }
  getTicketsByTenant(tenantId: string) { return this.afs.collection('maintenance_tickets', r => r.where('tenantId', '==', tenantId)).snapshotChanges(); }
  updateTicket(t: any) { return this.afs.doc('maintenance_tickets/' + t.id).update(t); }
  deleteTicket(id: string) { return this.afs.doc('maintenance_tickets/' + id).delete(); }

  // ─── Expenses ─────────────────────────────────────────────────────────────────
  addExpense(e: any) { e.id = this.afs.createId(); return this.afs.collection('expenses').add(e); }
  getAllExpenses() { return this.afs.collection('expenses', ref => ref.orderBy('date', 'desc')).snapshotChanges(); }
  getExpensesByOwner(ownerId: string) { return this.afs.collection('expenses', r => r.where('ownerId', '==', ownerId)).snapshotChanges(); }
  updateExpense(e: any) { return this.afs.doc('expenses/' + e.id).update(e); }
  deleteExpense(id: string) { return this.afs.doc('expenses/' + id).delete(); }

  // ─── Owner Statements ────────────────────────────────────────────────────────
  addStatement(s: any) { s.id = this.afs.createId(); return this.afs.collection('owner_statements').add(s); }
  getAllStatements() { return this.afs.collection('owner_statements', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges(); }
  getStatementsByOwner(ownerId: string) { return this.afs.collection('owner_statements', r => r.where('ownerId', '==', ownerId)).snapshotChanges(); }
  updateStatement(s: any) { return this.afs.doc('owner_statements/' + s.id).update(s); }

  // ─── Users ───────────────────────────────────────────────────────────────────
  getAllUsers() { return this.afs.collection('users').snapshotChanges(); }
  updateUser(uid: string, data: any) { return this.afs.doc('users/' + uid).update(data); }

  // ─── Enquiries ───────────────────────────────────────────────────────────────
  getAllEnquiry() { return this.afs.collection('enquiry/').snapshotChanges(); }
  addenquiry(e: any) { e.id = this.afs.createId(); return this.afs.collection('enquiry/').add(e); }
  deleteenquiry(id: string) { return this.afs.doc('enquiry/' + id).delete(); }
  addcallback(c: any) { c.id = this.afs.createId(); return this.afs.collection('callback/').add(c); }

  // ─── Audit Logs ──────────────────────────────────────────────────────────────
  addAuditLog(log: any) { log.id = this.afs.createId(); return this.afs.collection('audit_logs').add(log); }
  getAuditLogs() { return this.afs.collection('audit_logs', ref => ref.orderBy('timestamp', 'desc').limit(200)).snapshotChanges(); }
}
