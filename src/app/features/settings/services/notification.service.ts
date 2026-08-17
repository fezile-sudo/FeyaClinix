import { Injectable } from '@angular/core';

export interface NotificationSettings {
  newAppointments: boolean;
  appointmentChanges: boolean;
  appointmentCancellations: boolean;
  appointmentReminders: boolean;
  doctorAvailability: boolean;
  systemNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly storageKey = 'feyaClinicNotifications';

  private defaultSettings: NotificationSettings = {
    newAppointments: true,
    appointmentChanges: true,
    appointmentCancellations: true,
    appointmentReminders: true,
    doctorAvailability: false,
    systemNotifications: true
  };


  getNotificationSettings(): NotificationSettings {

    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return this.defaultSettings;
  }


  saveNotificationSettings(
    settings: NotificationSettings
  ): void {

    localStorage.setItem(this.storageKey, JSON.stringify(settings));

  }

}