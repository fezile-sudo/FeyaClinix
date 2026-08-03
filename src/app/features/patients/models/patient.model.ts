export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medicalConditions: string;
  insuranceProvider: string;
  status: 'Active' | 'Inactive';
}