Feya Clinix

Feya Clinix is a web-based hospital/clinic management application built with Angular, Angular Material, and a REST API connected to a database.

The application provides a centralized interface for managing patients, doctors, appointments, the appointment calendar, dashboard statistics, reports, and application preferences.

Features
Dashboard

The dashboard provides an overview of hospital activity, including:

Today's appointments

Total appointments

Pending appointments

Confirmed appointments

Completed appointments

Cancelled appointments

Total patients

Active patients

Inactive patients

Total doctors

Available doctors

Recent patients

Recent doctors

Upcoming appointments

Appointments can also be opened from the dashboard to view additional information.

Patient Management

The patient management section allows users to:

View patients

Search/filter patients

Add new patients

Edit existing patients

Delete patients

View patient information

Track patient status

Store contact information

Store emergency contact information

Store allergies and medical conditions

Store insurance information

Patient records are retrieved from and saved to the API/database.

Doctor Management

The doctor management section allows users to:

View doctors

Search/filter doctors

Add new doctors

Edit existing doctors

Delete doctors

Track doctor availability

Assign specialties

Assign departments

Store qualifications

Store license numbers

Store years of experience

Store consultation fees

The doctor form automatically determines the department based on the selected specialty where applicable.

Appointment Management

The appointment section allows users to:

View appointments

Create appointments

Edit appointments

Delete appointments

Assign patients

Assign doctors

Select appointment dates

Select appointment times

Track appointment status

Check doctor availability

Supported appointment statuses include:

Pending

Confirmed

Completed

Cancelled

The application checks doctor availability before appointments are created or updated.

Appointment Calendar

The calendar provides a visual representation of appointments.

Supported features include:

Monthly calendar view

Weekly calendar view

Previous/next month navigation

Doctor filtering

Status filtering

Today's date highlighting

Appointment details

Patient names

Doctor names

Appointment times

Appointment status

Optional weekend display

Configurable week start day

Appointments are loaded from the API/database rather than from static local data.

The calendar also handles appointment dates returned by the API in formats such as:

2026-09-18


and:

2026-09-18T00:00:00.000Z

Reports

The reports section provides hospital performance information, including:

Total patients

Active patients

Inactive patients

New patients

Total doctors

Available doctors

Total appointments

Completed appointments

Pending appointments

Cancelled appointments

Doctor appointment performance

Patient growth

Reports can be filtered by:

Doctor

Appointment status

From date

To date

Reports can also be exported as:

PDF

CSV/Excel-compatible file

The PDF report is generated using:

jsPDF

jspdf-autotable

Settings

The application contains preferences for configuring parts of the user interface.

The settings area includes calendar and display preferences such as:

Items per page

Calendar view

Week starting day

Weekend visibility

The Settings section is still an area for further testing and polishing.

Technology Stack
Frontend

Angular

TypeScript

Angular Material

RxJS

SCSS

Vite

API

The Angular application communicates with a REST API running locally.

The current API base URL is:

http://localhost:3000/api

Database

The application stores its main data through the backend API/database.

The frontend does not directly communicate with the database. Instead, Angular communicates with the API, and the API communicates with the database.

Main API Endpoints

The frontend currently uses endpoints similar to:

GET    /api/patients
GET    /api/patients/:id
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id

GET    /api/doctors
GET    /api/doctors/:id
POST   /api/doctors
PUT    /api/doctors/:id
DELETE /api/doctors/:id

GET    /api/appointments
GET    /api/appointments/:id
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id


Doctor availability is checked through:

GET /api/appointments/availability


with parameters for:

doctorId
date
time
ignoreAppointmentId

Project Structure

The application is organized into feature-based folders.

A simplified structure is:

src/
└── app/
    ├── dashboard/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    │
    ├── patients/
    │   ├── components/
    │   ├── models/
    │   ├── pages/
    │   └── services/
    │
    ├── doctors/
    │   ├── components/
    │   ├── models/
    │   ├── pages/
    │   └── services/
    │
    ├── appointments/
    │   ├── components/
    │   ├── models/
    │   ├── pages/
    │   └── services/
    │
    ├── calendar/
    │   ├── components/
    │   └── pages/
    │
    ├── reports/
    │   ├── components/
    │   └── pages/
    │
    └── settings/
        ├── components/
        ├── pages/
        └── services/

Important Services
PatientService

Responsible for communicating with the patient API.

src/app/patients/services/patient.ts


Provides methods for:

Getting all patients

Getting a patient by ID

Creating a patient

Updating a patient

Deleting a patient

DoctorService

Responsible for communicating with the doctor API.

src/app/doctors/services/doctor.service.ts


Provides methods for:

Getting all doctors

Getting a doctor by ID

Creating a doctor

Updating a doctor

Deleting a doctor

AppointmentService

Responsible for communicating with the appointment API.

src/app/appointments/services/appointment.service.ts


Provides methods for:

Getting all appointments

Getting an appointment by ID

Creating an appointment

Updating an appointment

Deleting an appointment

Checking doctor availability

PreferencesService

Responsible for application preferences.

src/app/settings/services/preferences.service.ts


This service is used by components such as the calendar and patient/doctor lists.

Running the Application

Install the project dependencies:

npm install


Start the development/API environment:

npm run dev


The application currently expects the API to be available at:

http://localhost:3000


Open the application in a browser using the development URL shown by Vite.

Development Workflow

When developing the application, start the development environment with:

npm run dev


Then make changes to the Angular source files.

Vite/Angular will normally rebuild the application automatically when files are saved.

Data Flow

The application follows this general flow:

Angular Component
       |
       v
Angular Service
       |
       v
HTTP Request
       |
       v
REST API
       |
       v
Database


For example, creating a patient follows this process:

PatientForm
    |
    v
PatientService.createPatient()
    |
    v
POST /api/patients
    |
    v
Backend API
    |
    v
Database


The API response is then returned to Angular.

Important Development Note

The application previously used local/static data in some areas.

The application has now been moved toward API/database-backed data.

Because of this, components should generally:

Request data from the service.

Subscribe to the Observable.

Update their local state.

Refresh/reload data after create, update, or delete operations when necessary.

For example:

this.patientService
  .getPatients()
  .subscribe({
    next: patients => {
      this.dataSource.data = patients;
    },
    error: error => {
      console.error(
        'Failed to load patients',
        error
      );
    }
  });


Avoid treating API-backed service methods as if they return ordinary arrays.

Refresh Behaviour

One of the issues encountered during development was that data could be successfully saved to the database but not immediately appear on another page.

For example:

Create patient
     |
     v
Database updated
     |
     v
Patient list still shows old data


The solution is to reload the relevant data after successful API operations.

This is especially important for:

Patient list

Doctor list

Appointment list

Dashboard

Reports

Calendar

The dashboard and reports already load their data directly from the API.

The calendar also reloads appointments from the API and applies the current filters.

Calendar Date Handling

The calendar compares appointment dates with calendar dates.

API dates may contain a time component:

2026-09-18T00:00:00.000Z


while the calendar generates:

2026-09-18


Therefore, appointment dates are normalized before comparison.

The important logic is:

const appointmentDate =
  String(appointment.date).split('T')[0];


This prevents appointments from disappearing simply because the API returned a full ISO date.

Exports
PDF

Reports can be exported to PDF using:

jsPDF
jspdf-autotable


The generated report contains:

Hospital name

Report title

Generation date

Patient statistics

Doctor statistics

Appointment statistics

Appointment table

CSV

Reports can also be exported as CSV.

The CSV can be opened in spreadsheet applications such as Microsoft Excel or LibreOffice Calc.

Current Development Status

The main application functionality is operational.

Working

Dashboard

Reports

Patient management

Doctor management

Appointment management

Appointment calendar

API/database communication

PDF export

CSV export

Doctor availability checking

Calendar filtering

Still to Review

The next development session should focus on small remaining issues and polishing rather than major restructuring.

Priority items:

Fully test Settings.

Verify that Settings preferences save correctly.

Verify calendar preferences.

Verify items-per-page preferences.

Verify month/week calendar preference.

Verify Monday/Sunday week-start preference.

Verify weekend visibility.

Re-test immediate refresh after adding/editing/deleting patients.

Re-test immediate refresh after adding/editing/deleting doctors.

Re-test appointment deletion and calendar refresh.

Inspect appointment-dialog.ts if calendar data does not refresh immediately after deleting an appointment.

Check for any remaining UI or data-refresh inconsistencies.

Troubleshooting
"Unable to connect to the server"

Make sure the backend/API development environment is running.

Use:

npm run dev


Then check that the API is available on:

http://localhost:3000

Data exists in the database but does not appear

Check that the Angular component is:

Calling the correct service method.

Subscribing to the returned Observable.

Updating its local array/data source.

Reloading data after create/update/delete operations.

Calendar appointments are not visible

Check:

The appointment exists in the database.

AppointmentService.getAppointments() returns the appointment.

filteredAppointments contains the appointment.

The appointment date is correctly formatted.

The calendar is displaying the month containing the appointment.

Doctor/status filters are not hiding the appointment.

The date comparison should normalize ISO dates before comparing them.

Future Improvements

Possible future improvements include:

Better loading indicators

User-friendly API error messages

Toast/snackbar notifications

Centralized API configuration

Environment-specific API URLs

Stronger TypeScript typing instead of any

Improved appointment refresh handling

Better state management

Authentication and authorization

Role-based access

Audit logging

More advanced reporting

Improved mobile responsiveness

Automated tests

Production deployment configuration

Development Principle

Feya Clinix should remain feature-based, API-driven, and maintainable.

When fixing bugs, prefer small targeted changes over unnecessary rewrites of working functionality.

Before modifying a component, verify where its data comes from:

Component
   ↓
Service
   ↓
API
   ↓
Database


This helps prevent frontend code from becoming out of sync with the actual database.

Project Name

Feya Clinix

Hospital and clinic management application.

Built with Angular, TypeScript, Angular Material, REST API services, and database-backed data management.
