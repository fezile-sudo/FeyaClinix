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

    if (!Number.isInteger(id)) {
      return;
    }

    this.patientService
      .getPatient(id)
      .subscribe({

        next: patient => {

          this.patient = patient;

          this.loadAppointments(patient.id);

        },

        error: error => {

          console.error('Failed to load patient', error);

        }

      });

  }

  private loadAppointments(
    patientId: number
  ): void {

    this.appointmentService
      .getAppointments()
      .subscribe({

        next: appointments => {

          this.appointments = appointments.filter(appointment => appointment.patientId === patientId);

        },

        error: error => {

          console.error('Failed to load appointments', error);

        }

      });

  }

  getDoctorName(
    doctorId: number
  ): string {

    const doctor =
      this.doctorService
        .getDoctor(doctorId);

    return 'Loading...';

  }

  getDepartment(
    doctorId: number
  ): string {

    return '-';

  }

}
