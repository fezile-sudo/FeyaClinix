import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { Appointment } from '../../../appointments/models/appointment.model';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../doctors/models/doctor.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';



@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.scss',
})
export class PatientDetails implements OnInit {


  private route = inject(ActivatedRoute);

  private patientService = inject(PatientService);

  private appointmentService = inject(AppointmentService);

  private doctorService = inject(DoctorService);

  patient?: Patient;

  appointments: Appointment[] = [];


ngOnInit(): void {

  const id = Number(this.route.snapshot.paramMap.get('id'));

    this.patient = this.patientService.getPatient(id);

    if(this.patient){
      this.appointments = this.appointmentService.getAppointments().filter(appointment => appointment.patientId === this.patient!.id);
    }
  }


  getDoctorName(doctorId:number):string {

    const doctor = this.doctorService.getDoctor(doctorId);

    return doctor
      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
      : 'Unknown Doctor';
  }


  getDepartment(doctorId:number):string {

    const doctor = this.doctorService.getDoctor(doctorId);

    return doctor?.department ?? '-';
  }

}
