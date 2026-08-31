import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';


@Injectable({providedIn: 'root'})

export class AppointmentService {

  private storageKey = 'feyaClinix_appointments';

  private appointments: Appointment[] = this.loadAppointments();

  private loadAppointments(): Appointment[] {

    const data = localStorage.getItem(this.storageKey);

    if(!data){
      return [];
    }

    try {
      return JSON.parse(data);
    }
    catch(error){
      console.error('Failed loading appointments',);
      return [];
    }

  }

  private saveAppointments(): void {

    localStorage.setItem(this.storageKey, JSON.stringify(this.appointments));

  }


  getAppointments(): Appointment[] {
    return this.appointments;
  }


  getAppointment(id:number): Appointment | undefined {

    return this.appointments.find(appointment => appointment.id === id);

  }





  createAppointment(appointment: Appointment): void {

    const newAppointment: Appointment = {...appointment, id: appointment.id || Date.now()};

    this.appointments.push(newAppointment);

    this.saveAppointments();

  }


  updateAppointment(id:number, updatedAppointment: Appointment): void {

    const index = this.appointments.findIndex(appointment => appointment.id === id);

    if(index !== -1){

      this.appointments[index] = {...updatedAppointment, id};

      this.saveAppointments();

    }

  }


  deleteAppointment(id:number):void {

    this.appointments = this.appointments.filter(appointment => appointment.id !== id);

    this.saveAppointments();

  }


  getTodayAppointmentsCount(): number {

    const today = new Date();

    const formatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    return this.appointments.filter( appointment => appointment.date === formatted).length;

  }


  isDoctorAvailable(doctorId:number, date:string, time:string, ignoreAppointmentId?:number): boolean {

    return !this.appointments.some(

      appointment =>
        appointment.doctorId === doctorId &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.id !== ignoreAppointmentId

    );

  }

}