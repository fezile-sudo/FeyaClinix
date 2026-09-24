import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss',
})
export class PatientForm implements OnInit {

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private patientService = inject(PatientService);


  patientId?: number;

  isEditMode = false;


  patientForm = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    gender: ['', Validators.required],

    bloodGroup: ['', Validators.required],

    dateOfBirth: ['', Validators.required],

    phone: ['', Validators.required],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    address: [''],

    emergencyContact: [''],

    emergencyPhone: [''],

    allergies: [''],

    medicalConditions: [''],

    insuranceProvider: ['']

  });


  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');


    if (id) {

      this.isEditMode = true;

      this.patientId = Number(id);


      this.patientService.getPatient(this.patientId).subscribe({

          next: patient => {

            this.patientForm.patchValue(patient);

          },

          error: error => {

            console.error('Failed to load patient', error);

          }

        });

    }

  }


  savePatient(): void {

    if (this.patientForm.invalid) {

      this.patientForm.markAllAsTouched();

      return;

    }


    const formValue = this.patientForm.value as Patient;


    if (
      this.isEditMode &&
      this.patientId !== undefined
    ) {

      this.patientService.updatePatient(this.patientId, formValue).subscribe({

          next: () => {

            this.router.navigate([
              '/patients'
            ]);

          },

          error: error => {

            console.error('Failed to update patient', error);

          }

        });

    } else {

      const newPatient: Patient = {

        ...formValue,

        id: 0,

        status: 'Active',

        createdAt: new Date().toISOString()

      };


      this.patientService
        .createPatient(newPatient)
        .subscribe({

          next: () => {

            this.router.navigate([
              '/patients'
            ]);

          },

          error: error => {

            console.error('Failed to create patient', error);

          }

        });

    }

  }

}
