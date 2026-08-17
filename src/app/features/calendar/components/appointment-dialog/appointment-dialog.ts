import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

import { Router } from '@angular/router';

import { AppointmentService } from '../../../appointments/services/appointment.service';

import { Appointment } from '../../../appointments/models/appointment.model';
import { Doctor } from '../../../doctors/models/doctor.model';
import { Patient } from '../../../patients/models/patient.model';


@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './appointment-dialog.html',
  styleUrl: './appointment-dialog.scss'
})
export class AppointmentDialog {

  appointment: Appointment;
  patient?: Patient;
  doctor?: Doctor;

  constructor(

    @Inject(MAT_DIALOG_DATA)
    data: {
      appointment: Appointment;
      patient?: Patient;
      doctor?: Doctor;
    },

    private dialogRef: MatDialogRef<AppointmentDialog>,
    private appointmentService: AppointmentService,
    private router: Router

  ){

    this.appointment = data.appointment;
    this.patient = data.patient;
    this.doctor = data.doctor;

  }

  editAppointment(): void {

    this.dialogRef.close();

    this.router.navigate(['/appointments/edit', this.appointment.id]);

  }


  deleteAppointment(): void {

    const confirmed = confirm('Are you sure you want to delete this appointment?');

    if(confirmed){

    this.appointmentService.deleteAppointment(this.appointment.id);

    this.dialogRef.close();
      window.location.reload();
    }


  }


}
