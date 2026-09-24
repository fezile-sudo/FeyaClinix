import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  map,
  tap
} from 'rxjs';

import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/appointments';

  private readonly appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  readonly appointments$ = this.appointmentsSubject.asObservable();


  getAppointments(): Observable<Appointment[]> {

    return this.http
      .get<Appointment[]>(this.apiUrl)
      .pipe(

        tap(appointments => {
          this.appointmentsSubject.next(
            appointments
          );
        })

      );

  }


  getAppointment(
    id: number
  ): Observable<Appointment> {

    return this.http.get<Appointment>(
      `${this.apiUrl}/${id}`
    );

  }


  isDoctorAvailable(
    doctorId: number,
    date: string,
    time: string,
    ignoreAppointmentId?: number
  ): Observable<boolean> {

    const params = new URLSearchParams({
      doctorId: String(doctorId),
      date,
      time
    });

    if (ignoreAppointmentId !== undefined) {

      params.set('ignoreAppointmentId', String(ignoreAppointmentId));

    }

    return this.http
      .get<{ available: boolean }>(
        `${this.apiUrl}/availability?${params.toString()}`
      )
      .pipe(
        map(response => response.available)
      );

  }


  createAppointment(
    appointment: Appointment
  ): Observable<Appointment> {

    return this.http
      .post<Appointment>(
        this.apiUrl,
        appointment
      )
      .pipe(

        tap(newAppointment => {

          const currentAppointments = this.appointmentsSubject.value;

          this.appointmentsSubject.next([
            ...currentAppointments,
            newAppointment
          ]);

        })

      );

  }


  updateAppointment(
    id: number,
    updatedAppointment: Appointment
  ): Observable<Appointment> {

    return this.http
      .put<Appointment>(
        `${this.apiUrl}/${id}`,
        updatedAppointment
      )
      .pipe(

        tap(updated => {

          const appointments =
            this.appointmentsSubject.value.map(
              appointment =>
                appointment.id === id
                  ? updated
                  : appointment
            );

          this.appointmentsSubject.next(
            appointments
          );

        })

      );

  }


  deleteAppointment(
    id: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`
      )
      .pipe(

        tap(() => {

          const appointments = this.appointmentsSubject.value.filter(
              appointment =>
                appointment.id !== id
            );

          this.appointmentsSubject.next(
            appointments
          );

        })

      );

  }

}


