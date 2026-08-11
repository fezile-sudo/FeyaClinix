import { Routes } from '@angular/router';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AppointmentsComponent } from './features/appointments/pages/appointments/appointment';
import { AppointmentForm } from './features/appointments/pages/appointment-form/appointment-form';
import { Calendar } from './features/calendar/pages/calendar/calendar';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
   children: [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
 {
  path: 'appointments',
  component: AppointmentsComponent
},
{
  path: 'appointments/new',
  component: AppointmentForm
},
{
  path: 'appointments/edit/:id',
  component: AppointmentForm
},
{
  path: 'calendar',
  component: Calendar
},
  {
  path: 'doctors',
  loadChildren: () =>
    import('./features/doctors/doctors.routes')
      .then(m => m.DOCTOR_ROUTES)
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./features/patients/patients.routes')
        .then(m => m.PATIENT_ROUTES)
  },
 {
  path: 'reports',
  loadChildren: () =>
    import('./features/reports/reports.routes')
      .then(m => m.REPORT_ROUTES)
} 
]
  }
];