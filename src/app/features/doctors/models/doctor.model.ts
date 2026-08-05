export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  specialty: string;
  qualification: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  department: string;
  availability: 'Available' | 'Busy' | 'On Leave';
  status: 'Active' | 'Inactive';
}