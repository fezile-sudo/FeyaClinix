import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../../patients/services/patient';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Patient } from '../../../patients/models/patient.model';
import { Doctor } from '../../../doctors/models/doctor.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreferencesService } from '../../../settings/services/preferences.service';


@Component({
  selector: 'app-appointments',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],

  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class AppointmentsComponent implements OnInit {

  private appointmentService = inject(AppointmentService);

  private patientService = inject(PatientService);

  private doctorService = inject(DoctorService);

  private preferencesService = inject(PreferencesService);

  private fb = inject(FormBuilder);


  appointments: Appointment[] = [];

  patients: Patient[] = [];

  doctors: Doctor[] = [];

  selectedDoctor?: Doctor;


  searchTerm = '';

  selectedStatus = 'All';

  showModal = false;

  isEditing = false;

  editingAppointmentId: number | null = null;

  displayedColumns: string[] = [
    'patient',
    'doctor',
    'department',
    'date',
    'time',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Appointment>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;


  appointmentForm = this.fb.group({

    patientId: this.fb.control<number | null>(null, Validators.required),

    doctorId: this.fb.control<number | null>(null, Validators.required),

    date: this.fb.control('', Validators.required),

    time: this.fb.control('', Validators.required),

    status: this.fb.control<Appointment['status']>('Pending', Validators.required),

    reason: this.fb.control(''),

    notes: this.fb.control('')

  });


  ngOnInit(): void {

    this.appointments = this.appointmentService.getAppointments();

    this.patients = this.patientService.getPatients();

    this.doctors = this.doctorService.getDoctors();

    this.dataSource.data = this.appointments;

    this.dataSource.filterPredicate = (appointment, filter) => {

      const patient = this.getPatientName(appointment.patientId).toLowerCase();

      const doctor = this.getDoctorName(appointment.doctorId).toLowerCase();

      const department = this.getDepartment(appointment.doctorId).toLowerCase();

      const search = filter.toLowerCase();

      const matchesSearch =
          !search ||
          patient.includes(search) ||
          doctor.includes(search) ||
          department.includes(search);

      const matchesStatus = this.selectedStatus === 'All' || appointment.status === this.selectedStatus;


        return matchesSearch && matchesStatus;
      };

  }


  ngAfterViewInit(): void {

    const preferences = this.preferencesService.getPreferences();

    this.paginator.pageSize = preferences.itemsPerPage;

    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

  }

   applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  applyStatusFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }


  openModal(): void {

    this.showModal = true;

  }

   closeModal(): void {

    this.showModal = false;

    this.isEditing = false;

    this.editingAppointmentId = null;

    this.selectedDoctor = undefined;

    this.appointmentForm.reset({status: 'Pending'});

  }

  onDoctorChange(): void {

    const doctorId = Number(this.appointmentForm.value.doctorId);

    this.selectedDoctor = this.doctors.find(doctor => doctor.id === doctorId);

  }


  saveAppointment(): void {

    if (this.appointmentForm.invalid) {
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

    const doctorAvailable = this.appointmentService.isDoctorAvailable(
        value.doctorId,
        value.date,
        value.time,
        this.editingAppointmentId ?? undefined
      );

    if (!doctorAvailable) {

      alert('This doctor already has an appointment at this date and time.');

      return;

    }


    const appointment: Appointment = {

      id: this.editingAppointmentId ?? Date.now(),
      patientId: value.patientId,
      doctorId: value.doctorId,
      date: value.date,
      time: value.time,
      status: value.status,
      reason: value.reason ?? '',
      notes: value.notes ?? ''

    };

    if (
      this.isEditing &&
      this.editingAppointmentId !== null
    ) {

      this.appointmentService.updateAppointment(this.editingAppointmentId, appointment);

    }

    else {

      this.appointmentService.createAppointment(
        appointment
      );

    }

    this.refreshAppointments();

    this.closeModal();

  }

  editAppointment(
    appointment: Appointment
  ): void {

    this.isEditing = true;

    this.editingAppointmentId = appointment.id;

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

    this.showModal = true;

  }

  deleteAppointment(
    id: number
  ): void {

    const confirmed = confirm('Are you sure you want to delete this appointment?');

    if (!confirmed) {
      return;

    }

    this.appointmentService.deleteAppointment(id);

    this.refreshAppointments();

  }

  changeStatus(
    appointment: Appointment,
    status: Appointment['status']
  ): void {

    const updated: Appointment = {...appointment, status};

    this.appointmentService.updateAppointment(appointment.id, updated);

    this.refreshAppointments();

  }


  getPatientName(
    id: number
  ): string {

    const patient = this.patientService.getPatient(id);

    return patient
      ? `${patient.firstName} ${patient.lastName}`
      : 'Unknown Patient';

  }


  getDoctorName(
    id: number
  ): string {

    const doctor = this.doctorService.getDoctor(id);

    return doctor
      ? `Dr. ${doctor.firstName} ${doctor.lastName}`
      : 'Unknown Doctor';

  }


  getDepartment(
    id: number
  ): string {

    const doctor = this.doctorService.getDoctor(id);

    return doctor?.department ?? '-';

  }


    private refreshAppointments(): void {

    this.appointments = this.appointmentService.getAppointments();

    this.dataSource.data = this.appointments;

    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

  }

}