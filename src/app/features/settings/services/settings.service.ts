import { Injectable } from '@angular/core';

export interface GeneralSettings {
  hospitalName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  dateFormat: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly storageKey = 'feyaClinicSettings';

  private defaultSettings: GeneralSettings = {
    hospitalName: 'FeyaClinic',
    contactEmail: 'admin@feyaclinic.com',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    timezone: 'europe-london',
    dateFormat: 'dd-mm-yyyy'
  };


  getGeneralSettings(): GeneralSettings {

    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return this.defaultSettings;
  }


  saveGeneralSettings(settings: GeneralSettings): void {

    localStorage.setItem(this.storageKey, JSON.stringify(settings));

  }

}