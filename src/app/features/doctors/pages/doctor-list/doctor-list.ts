import {
AfterViewInit,
Component,
OnInit,
ViewChild,
inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';
import {
MatTableDataSource,
MatTableModule
} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {
MatPaginator,
MatPaginatorModule
} from '@angular/material/paginator';
import {
MatSort,
MatSortModule
} from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
RouterLink
} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmation } from '../delete-confirmation/delete-confirmation';
import { PreferencesService } from '../../../settings/services/preferences.service';

@Component({
selector: 'app-doctor-list',
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
templateUrl: './doctor-list.html',
styleUrl: './doctor-list.scss'
})
export class DoctorList implements OnInit, AfterViewInit {

private doctorService = inject(DoctorService);

private dialog = inject(MatDialog);

private preferencesService = inject(PreferencesService);

displayedColumns: string[] = [
'id',
'name',
'specialty',
'department',
'availability',
'status',
'actions'
];

dataSource = new MatTableDataSource<Doctor>();

@ViewChild(MatPaginator)
paginator!: MatPaginator;

@ViewChild(MatSort)
sort!: MatSort;

ngOnInit(): void {


this.doctorService
  .doctors$
  .subscribe(doctors => {

    this.dataSource.data = doctors;

  });


this.loadDoctors();


}

private loadDoctors(): void {

this.doctorService
  .getDoctors()
  .subscribe({

    error: error => {

      console.error('Failed to load doctors', error);

    }

  });


}

ngAfterViewInit(): void {

const preferences = this.preferencesService.getPreferences();


this.paginator.pageSize = preferences.itemsPerPage;


this.dataSource.paginator = this.paginator;

this.dataSource.sort = this.sort;


}

applyFilter(event: Event): void {

const filterValue = (event.target as HTMLInputElement).value;


this.dataSource.filter = filterValue.trim().toLowerCase();


}

deleteDoctor(id: number): void {

const dialogRef = this.dialog.open(DeleteConfirmation);


dialogRef
  .afterClosed()
  .subscribe(result => {

    if (!result) {
      return;
    }


    this.doctorService
      .deleteDoctor(id)
      .subscribe({

        error: error => {

          console.error('Failed to delete doctor', error);

        }

      });

  });


}

}

