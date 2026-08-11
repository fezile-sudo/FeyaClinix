import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {


  private patients: Patient[] = [];


  constructor(){

    const savedPatients = localStorage.getItem('patients');

    if(savedPatients){

      this.patients = JSON.parse(savedPatients);

    }
    else{

      this.patients = [

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
          status: 'Active',
          createdAt: '2026-01-10'
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
          status: 'Active',
          createdAt: '2026-01-10'
        }

      ];

      this.savePatients();

    }

  }

  private savePatients(){

    localStorage.setItem('patients', JSON.stringify(this.patients));

  }

  getPatients(){

    return this.patients;

  }



  getPatient(id:number){

    return this.patients.find(p => p.id === id);

  }


createPatient(patient: Patient){

  const newPatient: Patient = {

    ...patient,

    id: Date.now(),

    status: 'Active',

    createdAt: new Date().toISOString()

  };


  this.patients.push(newPatient);

  this.savePatients();

}


  updatePatient(id:number, updatedPatient:Patient){

    const index = this.patients.findIndex(p => p.id === id);

    if(index !== -1){

      this.patients[index] = updatedPatient;

      this.savePatients();
    }
  }


  deletePatient(id:number){

    this.patients = this.patients.filter(p => p.id !== id);

    this.savePatients();

  }

}

