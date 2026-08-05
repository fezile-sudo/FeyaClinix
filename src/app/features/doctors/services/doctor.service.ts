import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';


@Injectable({providedIn: 'root'})

export class DoctorService {

  private storageKey = 'feyaClinix_doctors';

  private doctors: Doctor[] = this.loadDoctors();


  private loadDoctors(): Doctor[] {

    const data = localStorage.getItem(this.storageKey);

    if(!data){
      return [];
    }

    try {
      return JSON.parse(data);
    }
    catch(error){
      console.error('Failed loading doctors', error);
      return [];
    }

  }


  private saveDoctors(): void {

    localStorage.setItem(this.storageKey, JSON.stringify(this.doctors));

  }

  getDoctors(): Doctor[] {
    return this.doctors;
  }


  getDoctor(id:number): Doctor | undefined {

    return this.doctors.find(doctor => doctor.id === id);

  }


  createDoctor(doctor:Doctor):void {

    const newDoctor: Doctor = {...doctor, id: Date.now()};

    this.doctors.push(newDoctor);

    this.saveDoctors();

  }


  updateDoctor(id:number, updatedDoctor:Doctor):void {

    const index = this.doctors.findIndex(doctor => doctor.id === id);

    if(index !== -1){

      this.doctors[index] = {...updatedDoctor, id};

      this.saveDoctors();

    }

  }


  deleteDoctor(id:number):void {

    this.doctors = this.doctors.filter(doctor => doctor.id !== id);

    this.saveDoctors();

  }


}