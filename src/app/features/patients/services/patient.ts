import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private patients: Patient[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      phone: '0821234567',
      email: 'john.smith@email.com',
      address: 'Cape Town',
      bloodGroup: 'O+',
      emergencyContact: 'Mary Smith',
      emergencyPhone: '0829876543',
      allergies: 'None',
      medicalConditions: 'Hypertension',
      insuranceProvider: 'Discovery Health',
      status: 'Active'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: '1985-10-20',
      gender: 'Female',
      phone: '0834567890',
      email: 'sarah@email.com',
      address: 'Johannesburg',
      bloodGroup: 'A+',
      emergencyContact: 'Mike Johnson',
      emergencyPhone: '0831112233',
      allergies: 'Penicillin',
      medicalConditions: 'Asthma',
      insuranceProvider: 'Momentum Health',
      status: 'Active'
    }
  ];

  getPatients(): Patient[] {
    return this.patients;
  }

  getPatient(id: number): Patient | undefined {
    return this.patients.find(patient => patient.id === id);
  }

  deletePatient(id: number): void {
    this.patients = this.patients.filter(
      patient => patient.id !== id
    );
  }

createPatient(patient: Patient): void {

  const newPatient: Patient = {...patient, id: this.patients.length + 1, status: 'Active'};

  this.patients.push(newPatient);

}

updatePatient(
  id: number,
  updatedPatient: Patient
): void {

  const index = this.patients.findIndex(
    patient => patient.id === id
  );

  if (index !== -1) {
    this.patients[index] = {...updatedPatient, id, status: this.patients[index].status};
  }

}

}

