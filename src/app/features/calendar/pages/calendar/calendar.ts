import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';

import { PatientService } from '../../../patients/services/patient';
import { DoctorService } from '../../../doctors/services/doctor.service';

import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialog } from '../../components/appointment-dialog/appointment-dialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
  CommonModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule
],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {


  currentDate = new Date();

  monthName = '';

  calendarDays: (Date | null)[] = [];

  weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];


  appointments: Appointment[] = [];

  selectedDoctor = '';

  selectedStatus = '';

  viewMode = 'month';

  filteredAppointments: Appointment[] = [];


constructor(
  private appointmentService: AppointmentService,
  private patientService: PatientService,
  public doctorService: DoctorService,
  private router: Router,
  private dialog: MatDialog
){}


  ngOnInit(): void {

    this.appointments = this.appointmentService.getAppointments();

    this.filteredAppointments = this.appointments;

    this.generateCalendar();

  }


  generateCalendar(): void {

    this.calendarDays = [];

    const year = this.currentDate.getFullYear();

    const month = this.currentDate.getMonth();

    this.monthName = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric'});

    const firstDay = new Date(year, month, 1).getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();


    for(let i = 0; i < firstDay; i++){
      this.calendarDays.push(null);
    }

    for(let day = 1; day <= totalDays; day++){

      this.calendarDays.push(new Date(year, month, day));

    }

  }


  previousMonth(): void {
      this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );

    this.generateCalendar();

  }

  nextMonth(): void {
      this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );

    this.generateCalendar();

  }



  isToday(date: Date | null): boolean {

    if(!date) return false;

    const today = new Date();


    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );

  }



  getAppointmentsForDay(date: Date): Appointment[] {

    const formattedDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

    return this.filteredAppointments.filter( appointment => appointment.date === formattedDate);

  }



  getStatusClass(status: Appointment['status']): string {

    return status.toLowerCase();

  }


  getPatientName(patientId: number): string {

    const patient = this.patientService.getPatient(patientId);

      if(patient){

    return `${patient.firstName} ${patient.lastName}`;

  }

  return 'Unknown Patient';

}



getDoctorName(doctorId: number): string {

    const doctor = this.doctorService.getDoctor(doctorId);

      if(doctor){

    return `Dr. ${doctor.firstName} ${doctor.lastName}`;

  }


  return 'Unknown Doctor';

}

createAppointment(): void {

  this.router.navigate(['/appointments/new']);

}

openAppointment(app: Appointment): void {

    const patient = this.patientService.getPatient(app.patientId);

    const doctor = this.doctorService.getDoctor(app.doctorId);


        this.dialog.open(
          AppointmentDialog,
          {width: '450px', data: {appointment: app, patient, doctor}}
        );

}


      applyFilters(): void {

      this.filteredAppointments = this.appointments.filter(app => {

          const doctorMatch = !this.selectedDoctor || app.doctorId === Number(this.selectedDoctor);

          const statusMatch = !this.selectedStatus || app.status === this.selectedStatus;

          return doctorMatch && statusMatch;

        });
}

        getWeekDays(): Date[] {

          const date = new Date(this.currentDate);

          const day = date.getDay();

          const start = new Date(date);

          start.setDate(date.getDate() - day);


          return Array.from(
            {length: 7},
            (_, index) => {

              const result = new Date(start);

              result.setDate(start.getDate() + index);

              return result;

            }
          );

        }

}
