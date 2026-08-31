import { Routes } from '@angular/router';

import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AppointmentsComponent } from './features/appointments/pages/appointments/appointment';
import { AppointmentForm } from './features/appointments/pages/appointment-form/appointment-form';
import { Calendar } from './features/calendar/pages/calendar/calendar';
import { Login } from './features/auth/pages/login/login';
import { AccessDenied } from './features/auth/pages/access-denied/access-denied';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { roleGuard } from './core/guards/role-guard';


export const routes: Routes = [

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },

  {
    path: 'access-denied',
    component: AccessDenied
  },

  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],

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
        canActivate: [roleGuard],
        data: {
          roles: ['Administrator']
        },
        loadChildren: () =>
          import('./features/doctors/doctors.routes')
            .then(m => m.DOCTOR_ROUTES)
      },

      {
        path: 'patients',
        canActivate: [roleGuard],
        data: {
          roles: [
            'Administrator',
            'Doctor',
            'Receptionist'
          ]
        },
        loadChildren: () =>
          import('./features/patients/patients.routes')
            .then(m => m.PATIENT_ROUTES)
      },

      {
        path: 'reports',
        canActivate: [roleGuard],
        data: {
          roles: [
            'Administrator',
            'Doctor'
          ]
        },
        loadChildren: () =>
          import('./features/reports/reports.routes')
            .then(m => m.REPORT_ROUTES)
      },

      {
        path: 'settings',
        canActivate: [roleGuard],
        data: {
          roles: ['Administrator']
        },
        loadChildren: () =>
          import('./features/settings/settings.routes')
            .then(m => m.SETTINGS_ROUTES)
      }

    ]
  }

];
