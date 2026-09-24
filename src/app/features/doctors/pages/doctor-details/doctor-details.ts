import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

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

  patients: Patient[] = [];

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadDoctor(id);

    this.loadAppointments();

    this.loadPatients();

  }

  private loadDoctor(id: number): void {

    this.doctorService
      .getDoctor(id)
      .subscribe({

        next: doctor => {
          this.doctor = doctor;

          this.appointments = this.appointments.filter(
              appointment => appointment.doctorId === doctor.id
            );
        },

        error: error => {

          console.error('Failed to load doctor', error);

        }

      });

  }

  private loadAppointments(): void {

    this.appointmentService
      .getAppointments()
      .subscribe({

        next: appointments => {

          this.appointments = this.doctor
              ? appointments.filter(
                  appointment =>
                    appointment.doctorId ===
                    this.doctor!.id
                )
              : appointments;

        },

        error: error => {

          console.error('Failed to load appointments', error);

        }

      });

  }

  private loadPatients(): void {

    this.patientService
      .getPatients()
      .subscribe({

        next: patients => {
          this.patients = patients;
        },

        error: error => {

          console.error('Failed to load patients', error);

        }

      });

  }

  getPatientName(patientId: number): string {

    const patient = this.patients.find(
        patient => patient.id === patientId
      );

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : 'Unknown Patient';

  }

}

