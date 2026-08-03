import { Routes } from '@angular/router';

import { PatientList } from './pages/patient-list/patient-list';
import { PatientForm } from './pages/patient-form/patient-form';
import { PatientDetails } from './pages/patient-details/patient-details';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    component: PatientList
  },
  {
    path: 'new',
    component: PatientForm
  },
  {
    path: ':id',
    component: PatientDetails
  },
  {
    path: ':id/edit',
    component: PatientForm
  }
];