import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';
import { PatientService } from '../../../patients/services/patient';
import { Patient } from '../../../patients/models/patient.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
})
export class DoctorDetails implements OnInit {

  private route = inject(ActivatedRoute);

  private doctorService = inject(DoctorService);

  private appointmentService = inject(AppointmentService);

  private patientService = inject(PatientService);


  doctor?: Doctor;

  appointments: Appointment[] = [];


  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.doctor = this.doctorService.getDoctor(id);

    if(this.doctor){

      this.appointments = this.appointmentService.getAppointments().filter(appointment => appointment.doctorId === this.doctor!.id);

    }

  }



  getPatientName(patientId:number):string {

    const patient = this.patientService.getPatient(patientId);

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : 'Unknown Patient';

  }

}
