import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './doctor-form.html',
  styleUrl: './doctor-form.scss'
})
export class DoctorForm {

  private fb = inject(FormBuilder);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private doctorService = inject(DoctorService);

  doctorId?: number;

  isEditMode = false;

  specialties = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Gynecology',
    'Internal Medicine',
    'Neurology',
    'Neurosurgery',
    'Obstetrics',
    'Oncology',
    'Ophthalmology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Urology'
  ];

  specialtyDepartmentMap: Record<string, string> = {
    'Cardiology': 'Cardiology',
    'Dermatology': 'Dermatology',
    'Emergency Medicine': 'Emergency',
    'Endocrinology': 'Internal Medicine',
    'Family Medicine': 'General Medicine',
    'Gastroenterology': 'Internal Medicine',
    'General Surgery': 'Surgery',
    'Gynecology': 'Gynecology',
    'Internal Medicine': 'Internal Medicine',
    'Neurology': 'Neurology',
    'Neurosurgery': 'Surgery',
    'Obstetrics': 'Gynecology',
    'Oncology': 'Oncology',
    'Ophthalmology': 'Ophthalmology',
    'Orthopedics': 'Orthopedics',
    'Pediatrics': 'Pediatrics',
    'Psychiatry': 'Mental Health',
    'Pulmonology': 'Internal Medicine',
    'Radiology': 'Radiology',
    'Urology': 'Urology'
  };

  doctorForm = this.fb.group({

    firstName: ['', Validators.required],

    lastName: ['', Validators.required],

    gender: ['', Validators.required],

    dateOfBirth: ['', Validators.required],

    phone: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    address: [''],

    specialty: ['', Validators.required],

    department: [{ value: '', disabled: false }],

    qualification: ['', Validators.required],

    licenseNumber: ['', Validators.required],

    yearsOfExperience: [0, [Validators.required, Validators.min(0)]],

    consultationFee: [0, [Validators.required, Validators.min(0)]],

    availability: ['', Validators.required]

  });

  ngOnInit(): void {

    this.doctorForm.get('specialty')?.valueChanges.subscribe(specialty => {

      if (!specialty) {
        return;
      }

      const department = this.specialtyDepartmentMap[specialty];

      this.doctorForm.patchValue({
        department
      });

    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;

      this.doctorId = Number(id);

      const doctor = this.doctorService.getDoctor(this.doctorId);

      if (doctor) {

        this.doctorForm.patchValue({
          ...doctor,
          yearsOfExperience: doctor.yearsOfExperience,
          consultationFee: doctor.consultationFee
        });

      }

    }

  }

  saveDoctor(): void {

    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const doctor = this.doctorForm.getRawValue() as Doctor;

    if (this.isEditMode && this.doctorId) {

      this.doctorService.updateDoctor(
        this.doctorId,
        doctor
      );

    } else {

      this.doctorService.createDoctor(
        doctor
      );

    }

    this.router.navigate(['/doctors']);

  }

}
