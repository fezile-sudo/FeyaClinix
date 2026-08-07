import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmation } from '../delete-confirmation/delete-confirmation';


@Component({
  selector: 'app-patient-list',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
})
export class PatientList {

  private patientService = inject(PatientService);

  private dialog = inject(MatDialog);

 get hasPatients(): boolean {
  return this.dataSource.data.length > 0;
} 

deletePatient(id: number): void {

  const dialogRef = this.dialog.open(DeleteConfirmation);


  dialogRef.afterClosed().subscribe(result => {

    if (result) {

      this.patientService.deletePatient(id);

      this.dataSource.data = [...this.patientService.getPatients()];

    }

  });

}


  displayedColumns: string[] = [
    'id',
    'name',
    'gender',
    'phone',
    'bloodGroup',
    'status',
    'actions'
  ];


  dataSource = new MatTableDataSource<Patient>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;


  ngOnInit() {
    const patients = this.patientService.getPatients();
    this.dataSource.data = patients;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      filterValue.trim().toLowerCase();

  }

}
