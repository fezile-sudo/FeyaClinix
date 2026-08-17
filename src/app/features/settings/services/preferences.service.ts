import { Injectable } from '@angular/core';

export interface PreferenceSettings {
  calendarView: 'month' | 'week' ;
  weekStartsOn: 'sunday' | 'monday';
  showWeekends: boolean;
  autoRefreshDashboard: boolean;
  itemsPerPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private readonly storageKey = 'feyaClinicPreferences';

  private defaultSettings: PreferenceSettings = {
  calendarView: 'month',
  weekStartsOn: 'monday',
  showWeekends: true,
  autoRefreshDashboard: false,
  itemsPerPage: 10
};


  getPreferences(): PreferenceSettings {

    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return this.defaultSettings;
  }


  savePreferences(
    settings: PreferenceSettings
  ): void {

    localStorage.setItem(this.storageKey, JSON.stringify(settings));

  }

}