import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/patients';

  private readonly patientsSubject = new BehaviorSubject<Patient[]>([]);

  readonly patients$ = this.patientsSubject.asObservable();


  getPatients(): Observable<Patient[]> {

    return this.http
      .get<Patient[]>(this.apiUrl)
      .pipe(
        tap(patients => {
          this.patientsSubject.next(patients);
        })
      );

  }


  getPatient(id: number): Observable<Patient> {

    return this.http.get<Patient>(
      `${this.apiUrl}/${id}`
    );

  }


  createPatient(patient: Patient): Observable<Patient> {

    return this.http
      .post<Patient>(
        this.apiUrl,
        patient
      )
      .pipe(

        tap(newPatient => {

          const currentPatients = this.patientsSubject.value;

          this.patientsSubject.next([
            ...currentPatients,
            newPatient
          ]);

        })

      );

  }


  updatePatient(
    id: number,
    updatedPatient: Patient
  ): Observable<Patient> {

    return this.http
      .put<Patient>(
        `${this.apiUrl}/${id}`,
        updatedPatient
      )
      .pipe(

        tap(updated => {

          const patients = this.patientsSubject.value.map(
              patient =>
                patient.id === id
                  ? updated
                  : patient
            );

          this.patientsSubject.next(patients);

        })

      );

  }


  deletePatient(
    id: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        tap(() => {

          const patients = this.patientsSubject.value.filter(
              patient =>
                patient.id !== id
            );

          this.patientsSubject.next(patients);

        })

      );

  }

}



