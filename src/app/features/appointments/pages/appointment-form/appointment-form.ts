import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { PatientService } from '../../../patients/services/patient';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';

import { Patient } from '../../../patients/models/patient.model';
import { Doctor } from '../../../doctors/models/doctor.model';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.scss'
})
export class AppointmentForm implements OnInit {

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private patientService = inject(PatientService);

  private doctorService = inject(DoctorService);

  private appointmentService =
    inject(AppointmentService);

  patients: Patient[] = [];

  doctors: Doctor[] = [];

  selectedDoctor?: Doctor;

  appointmentId?: number;

  isEditMode = false;

  appointmentForm = this.fb.group({

    patientId: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    doctorId: this.fb.control<number | null>(
      null,
      Validators.required
    ),

    date: this.fb.control('', Validators.required),

    time: this.fb.control('', Validators.required),

    status: this.fb.control<
      Appointment['status']
    >(
      'Pending',
      Validators.required
    ),

    reason: this.fb.control(''),

    notes: this.fb.control('')

  });

  ngOnInit(): void {

    this.loadPatients();

    this.loadDoctors();

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.isEditMode = true;

    this.appointmentId = Number(id);

    this.loadAppointment(this.appointmentId);

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

  private loadDoctors(): void {

    this.doctorService
      .getDoctors()
      .subscribe({

        next: doctors => {

          this.doctors = doctors;

          this.onDoctorChange();

        },

        error: error => {

          console.error('Failed to load doctors', error);

        }

      });

  }

  private loadAppointment(id: number): void {

    this.appointmentService
      .getAppointment(id)
      .subscribe({

        next: appointment => {

          this.appointmentForm.patchValue({

            patientId: appointment.patientId,

            doctorId: appointment.doctorId,

            date: appointment.date,

            time: appointment.time,

            status: appointment.status,

            reason: appointment.reason ?? '',

            notes: appointment.notes ?? ''

          });

          this.onDoctorChange();

        },

        error: error => {

          console.error('Failed to load appointment', error);

          this.router.navigate([
            '/appointments'
          ]);

        }

      });

  }

  onDoctorChange(): void {

    const doctorId = this.appointmentForm.value.doctorId;

    this.selectedDoctor = this.doctors.find(doctor => doctor.id === doctorId);

  }

  saveAppointment(): void {

    if (this.appointmentForm.invalid) {

      this.appointmentForm.markAllAsTouched();

      return;

    }

    const value = this.appointmentForm.getRawValue();

    if (
      value.patientId === null ||
      value.doctorId === null ||
      !value.date ||
      !value.time ||
      !value.status
    ) {

      return;

    }

    const appointment = {

      patientId: value.patientId,

      doctorId: value.doctorId,

      date: value.date,

      time: value.time,

      status: value.status,

      reason: value.reason ?? '',

      notes: value.notes ?? ''

    };

    if (
      this.isEditMode &&
      this.appointmentId
    ) {

      this.appointmentService
        .updateAppointment(this.appointmentId, appointment as Appointment)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/appointments'
            ]);

          },

          error: error => {

            console.error('Failed to update appointment', error);

          }

        });

    } else {

      this.appointmentService
        .createAppointment(appointment as Appointment)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/appointments'
            ]);

          },

          error: error => {

            console.error('Failed to create appointment', error);

          }

        });

    }

  }

}

