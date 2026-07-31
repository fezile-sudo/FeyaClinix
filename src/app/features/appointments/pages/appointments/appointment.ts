import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class AppointmentsComponent implements OnInit {

  appointments: Appointment[] = [];

  searchTerm = '';

  selectedStatus = 'All';

 get filteredAppointments(): Appointment[] {

  return this.appointments.filter(appointment => {

    const matchesSearch =
      !this.searchTerm ||
      appointment.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      appointment.department.toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchesStatus =
      this.selectedStatus === 'All' ||
      appointment.status === this.selectedStatus;

    return matchesSearch && matchesStatus;

  });

}

  showModal = false;

  isEditing = false;
  editingAppointmentId: number | null = null; 

  appointmentForm!: ReturnType<FormBuilder['group']>;



  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder
  ) {}

 ngOnInit(): void {

  this.appointments = this.appointmentService.getAppointments();

  this.appointmentForm = this.fb.group({
    patientName: ['', Validators.required],
    doctorName: ['', Validators.required],
    department: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    status: ['Pending', Validators.required]
  });

} 

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {

    this.showModal = false;

    this.isEditing = false;
    this.editingAppointmentId = null;

    this.appointmentForm.reset({
      status: 'Pending'
    });

  }





saveAppointment(): void {

  if (!this.appointmentForm || this.appointmentForm.invalid) {
    return;
  }

  if (this.isEditing && this.editingAppointmentId !== null) {

    const index = this.appointments.findIndex(
      appointment => appointment.id === this.editingAppointmentId
    );

if (index !== -1) {

  this.appointments[index] = {
    id: this.editingAppointmentId,
    patientName: this.appointmentForm.value.patientName!,
    doctorName: this.appointmentForm.value.doctorName!,
    department: this.appointmentForm.value.department!,
    date: this.appointmentForm.value.date!,
    time: this.appointmentForm.value.time!,
    status: this.appointmentForm.value.status!
  };

  this.appointmentService.saveAppointments();

}

  } else {

    const newAppointment: Appointment = {
      id: Date.now(),
      patientName: this.appointmentForm.value.patientName!,
      doctorName: this.appointmentForm.value.doctorName!,
      department: this.appointmentForm.value.department!,
      date: this.appointmentForm.value.date!,
      time: this.appointmentForm.value.time!,
      status: this.appointmentForm.value.status!
    };

    this.appointments.push(newAppointment);
    this.appointmentService.saveAppointments();
  }

  this.closeModal();

  this.appointmentForm.reset({
    status: 'Pending'
  });

  this.isEditing = false;
  this.editingAppointmentId = null;

}


deleteAppointment(id: number): void {

  const confirmed = confirm(
    'Are you sure you want to delete this appointment?'
  );

  if (!confirmed) {
    return;
  }

  this.appointments = this.appointments.filter(
    appointment => appointment.id !== id
  );

  this.appointmentService.saveAppointments();
}


editAppointment(appointment: Appointment): void {

  this.isEditing = true;
  this.editingAppointmentId = appointment.id;

  this.appointmentForm.patchValue({
    patientName: appointment.patientName,
    doctorName: appointment.doctorName,
    department: appointment.department,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status
  });

  this.showModal = true;
}

}
