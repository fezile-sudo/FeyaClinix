import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/doctors';

  private readonly doctorsSubject = new BehaviorSubject<Doctor[]>([]);

  readonly doctors$ = this.doctorsSubject.asObservable();


  getDoctors(): Observable<Doctor[]> {

    return this.http
      .get<Doctor[]>(this.apiUrl)
      .pipe(

        tap(doctors => {
          this.doctorsSubject.next(doctors);
        })

      );

  }


  getDoctor(id: number): Observable<Doctor> {

    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);

  }


  createDoctor(
    doctor: Doctor
  ): Observable<Doctor> {

    return this.http
      .post<Doctor>(
        this.apiUrl,
        doctor
      )
      .pipe(

        tap(newDoctor => {

          const currentDoctors = this.doctorsSubject.value;

          this.doctorsSubject.next([
            ...currentDoctors,
            newDoctor
          ]);

        })

      );

  }


  updateDoctor(
    id: number,
    updatedDoctor: Doctor
  ): Observable<Doctor> {

    return this.http
      .put<Doctor>(
        `${this.apiUrl}/${id}`,
        updatedDoctor
      )
      .pipe(

        tap(updated => {

          const doctors = this.doctorsSubject.value.map(
              doctor =>
                doctor.id === id
                  ? updated
                  : doctor
            );

          this.doctorsSubject.next(doctors);

        })

      );

  }


  deleteDoctor(
    id: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        tap(() => {

          const doctors = this.doctorsSubject.value.filter(
              doctor =>
                doctor.id !== id
            );

          this.doctorsSubject.next(doctors);

        })

      );

  }

}

