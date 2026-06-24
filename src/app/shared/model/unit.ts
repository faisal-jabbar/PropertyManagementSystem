export interface Unit {
  id: string;
  propertyId: string;
  unitNo: string;
  floor: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  targetRent: number;
  status: 'Vacant' | 'Occupied' | 'Reserved' | 'Under Maintenance' | 'Legal Issue' | 'Not Available';
  createdAt?: any;
}
