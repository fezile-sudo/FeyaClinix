import { Component, OnInit } from '@angular/core';
import { StatCard } from '../../../dashboard/components/stat-card/stat-card';
import { ReportFilters } from '../../components/report-filters/report-filters';
import { AppointmentStatusChart } from '../../components/appointment-status-chart/appointment-status-chart';
import { DoctorPerformanceChart } from '../../components/doctor-performance-chart/doctor-performance-chart';
import { PatientGrowthChart } from '../../components/patient-growth-chart/patient-growth-chart';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { PatientService } from '../../../patients/services/patient';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    StatCard,
    ReportFilters,
    AppointmentStatusChart,
    DoctorPerformanceChart,
    PatientGrowthChart,
    DatePipe
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit {


  totalPatients = 0;
  activePatients = 0;
  inactivePatients = 0;
  newPatients = 0;

  totalDoctors = 0;
  availableDoctors = 0;

  totalAppointments = 0;
  completedAppointments = 0;
  cancelledAppointments = 0;
  pendingAppointments = 0;

  allAppointments: any[] = [];

  selectedDoctor = 'All Doctors';
  selectedStatus = 'All';
  doctorPerformance: any[] = [];

  patientGrowth: any[] = [];

  lastUpdated = new Date();



  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {

    this.loadReports();

  }

    private loadReports(): void {

    this.allAppointments = this.appointmentService.getAppointments();

    const patients = this.patientService.getPatients();

    this.totalPatients = patients.length;

    this.activePatients = patients.filter(patient => patient.status === 'Active').length;

    this.inactivePatients = patients.filter(patient => patient.status === 'Inactive').length;

    const now = new Date();



    this.newPatients = patients.filter(patient => {
        if (!patient.createdAt) {
          return false;
        }

    const createdDate = new Date(patient.createdAt);
        return (
          createdDate.getMonth() === now.getMonth()
          &&
          createdDate.getFullYear() === now.getFullYear()
        );
      }).length;


    const monthlyData: any = {};

    patients.forEach(patient => {
      if (!patient.createdAt) {
        return;
      }

    const date = new Date(patient.createdAt);

    const month = date.toLocaleString('default', {month: 'short'});
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month]++;
    });

    this.patientGrowth = Object.keys(monthlyData).map(month => ({month, patients: monthlyData[month]}));

    const doctors = this.doctorService.getDoctors();

    this.totalDoctors = doctors.length;

    this.availableDoctors = doctors.filter(doctor => doctor.availability === 'Available').length;

    this.doctorPerformance = doctors.map(doctor => {

    const appointmentCount = this.allAppointments.filter(appointment => appointment.doctorId === doctor.id).length;
        return {
          name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          appointments: appointmentCount
        };

      });

    this.updateAppointmentCards(this.allAppointments);

  }

  applyFilters(filters: any): void {

    this.selectedDoctor = filters.doctor;

    this.selectedStatus = filters.status;

    let filteredAppointments = this.allAppointments;

    if (filters.fromDate) {

      filteredAppointments = filteredAppointments.filter(appointment => new Date(appointment.date) >= new Date(filters.fromDate));

    }

    if (filters.toDate) {

      filteredAppointments = filteredAppointments.filter(appointment => new Date(appointment.date) <= new Date(filters.toDate));

    }


    if (this.selectedStatus !== 'All') {

      filteredAppointments = filteredAppointments.filter(appointment => appointment.status === this.selectedStatus);

    }

    if (this.selectedDoctor !== 'All Doctors') {

      const doctor = this.doctorService.getDoctors().find(doctor => `Dr. ${doctor.firstName} ${doctor.lastName}` === this.selectedDoctor);

      if (doctor) {

        filteredAppointments = filteredAppointments.filter(appointment => appointment.doctorId === doctor.id);

      }

    }

    this.updateAppointmentCards(filteredAppointments);

    this.lastUpdated = new Date();
  }

    private updateAppointmentCards(
    appointments: any[]
  ): void {


    this.totalAppointments = appointments.length;

    this.completedAppointments = appointments.filter(appointment => appointment.status === 'Completed').length;

    this.pendingAppointments = appointments.filter(appointment => appointment.status === 'Pending').length;

    this.cancelledAppointments = appointments.filter(appointment => appointment.status === 'Cancelled').length;

  }


  exportPdf(): void {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Feya Clinix', 14, 20);

  doc.setFontSize(14);
  doc.text('Hospital Performance Report', 14, 30);

 
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

  doc.setFontSize(12);

  doc.text(`Total Patients: ${this.totalPatients}`, 14, 52);
  doc.text(`Active Patients: ${this.activePatients}`, 14, 60);
  doc.text(`New Patients: ${this.newPatients}`, 14, 68);

  doc.text(`Total Doctors: ${this.totalDoctors}`, 110, 52);
  doc.text(`Available Doctors: ${this.availableDoctors}`, 110, 60);

  doc.text(`Appointments: ${this.totalAppointments}`, 14, 84);
  doc.text(`Completed: ${this.completedAppointments}`, 14, 92);
  doc.text(`Pending: ${this.pendingAppointments}`, 14, 100);
  doc.text(`Cancelled: ${this.cancelledAppointments}`, 14, 108);

 
  autoTable(doc, {

    startY: 120,

    head: [['Patient', 'Doctor', 'Date', 'Time', 'Status']],

    body: this.allAppointments.map(appointment => {

    const patient = this.patientService.getPatient(appointment.patientId);

    const doctor =this.doctorService.getDoctor(appointment.doctorId);

      return [

        patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'Unknown',

        doctor
          ? `Dr. ${doctor.firstName} ${doctor.lastName}`
          : 'Unknown',

        appointment.date,

        appointment.time,

        appointment.status

      ];

    })

  });

  const today = new Date().toISOString().split('T')[0];

  doc.save(`FeyaClinix_Report_${today}.pdf`);

}






exportExcel(): void {
if (this.allAppointments.length === 0) {

  alert('There are no appointments to export.');

  return;

}
  const rows = this.allAppointments.map(appointment => {

  const patient = this.patientService.getPatient(appointment.patientId);

  const doctor = this.doctorService.getDoctor(appointment.doctorId);

    return {

      Patient:
        patient
          ? `${patient.firstName} ${patient.lastName}`
          : 'Unknown',

      Doctor:
        doctor
          ? `Dr. ${doctor.firstName} ${doctor.lastName}`
          : 'Unknown',

      Date: appointment.date,

      Time: appointment.time,

      Status: appointment.status

    };

  });

  const headers = Object.keys(rows[0]);

  const csv = [

    headers.join(','),

    ...rows.map(row =>
      headers.map(header => row[header as keyof typeof row]).join(',')
    )

  ].join('\n');


  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = 'appointments-report.csv';

  link.click();

  window.URL.revokeObjectURL(url);

}

}