import {
  Component,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DoctorService } from '../../../doctors/services/doctor.service';

import { Doctor } from '../../../doctors/models/doctor.model';


@Component({
  selector: 'app-report-filters',
  standalone: true,

  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],

  templateUrl: './report-filters.html',
  styleUrl: './report-filters.scss'
})
export class ReportFilters implements OnInit {

  doctors: {
    id: number;
    name: string;
  }[] = [];

  statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Completed',
    'Cancelled'
  ];

  selectedDoctor = 'All Doctors';

  selectedStatus = 'All';

  fromDate: Date | null = null;

  toDate: Date | null = null;


  @Output()
  generate = new EventEmitter();


  constructor(
    private doctorService: DoctorService
  ) {}


  ngOnInit(): void {

    this.doctorService
      .getDoctors()
      .subscribe({

        next: (doctors: Doctor[]) => {

          this.doctors = [
            {
              id: 0,
              name: 'All Doctors'
            },

            ...doctors.map(
              (doctor: Doctor) => ({
                id: doctor.id,
                name:
                  `Dr. ${doctor.firstName} ${doctor.lastName}`
              })
            )

          ];

        },

        error: error => {

          console.error(
            'Failed to load doctors',
            error
          );

        }

      });

  }


  generateReport(): void {

    this.generate.emit({

      doctor: this.selectedDoctor,

      status: this.selectedStatus,

      fromDate: this.fromDate,

      toDate: this.toDate

    });

  }

}
