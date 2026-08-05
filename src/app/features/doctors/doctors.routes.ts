import { Routes } from '@angular/router';

import { DoctorList } from './pages/doctor-list/doctor-list';
import { DoctorForm } from './pages/doctor-form/doctor-form';
import { DoctorDetails } from './pages/doctor-details/doctor-details';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: DoctorList
  },
  {
    path: 'new',
    component: DoctorForm
  },
  {
    path: ':id',
    component: DoctorDetails
  },
  {
    path: ':id/edit',
    component: DoctorForm
  }
];