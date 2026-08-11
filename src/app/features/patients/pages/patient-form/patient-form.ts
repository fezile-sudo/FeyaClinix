import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-patient-form',
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
export class PatientForm {

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

    dateOfBirth: ['',Validators.required],

    phone: ['', Validators.required],

    email: ['', [ Validators.required, Validators.email]],

    address: [''],

    emergencyContact: [''],

    emergencyPhone: [''],

    allergies: [''],

    medicalConditions: [''],

    insuranceProvider: ['']

  });

ngOnInit() {

  const id = this.route.snapshot.paramMap.get('id');


  if (id) {

    this.isEditMode = true;

    this.patientId = Number(id);

    const patient = this.patientService.getPatient(this.patientId);

    if (patient) {this.patientForm.patchValue(patient);}

  }
}

savePatient() {
  if (this.patientForm.invalid) {
    return;
  }
  if (this.isEditMode && this.patientId) {
    this.patientService.updatePatient(this.patientId, this.patientForm.value as Patient);

  } else {


  const newPatient: Patient = {

    ...this.patientForm.value as Patient,

    id: Date.now(),

    status: 'Active',

    createdAt: new Date().toISOString()

  };


  this.patientService.createPatient(newPatient);


}

  this.router.navigate(['/patients']);
}
}
