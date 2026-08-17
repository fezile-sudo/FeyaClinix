import { Injectable, signal } from '@angular/core';

export interface AppearanceSettings {
  theme: 'light' | 'dark';
  sidebar: 'expanded' | 'compact';
  colorScheme: 'blue' | 'teal' | 'purple';
}

@Injectable({
  providedIn: 'root'
})
export class AppearanceService {

  private readonly storageKey = 'feyaClinicAppearance';

  private defaultSettings: AppearanceSettings = {theme: 'light', sidebar: 'expanded', colorScheme: 'blue'};

  appearanceSettings = signal<AppearanceSettings>(
    this.getAppearanceSettings()
  );


  getAppearanceSettings(): AppearanceSettings {

    const savedSettings = localStorage.getItem(this.storageKey);

    if (savedSettings) {
      return JSON.parse(savedSettings);
    }

    return this.defaultSettings;
  }


  saveAppearanceSettings(
    settings: AppearanceSettings
  ): void {

    localStorage.setItem(this.storageKey, JSON.stringify(settings));

    this.appearanceSettings.set(settings);

    this.applyAppearance(settings);
  }


  applyAppearance(
  settings: AppearanceSettings
): void {

  const body = document.body;

  body.classList.remove('theme-light', 'theme-dark');

  body.classList.add( `theme-${settings.theme}`);

  body.classList.remove('color-blue', 'color-teal', 'color-purple');

  body.classList.add(`color-${settings.colorScheme}`);

}


  initializeAppearance(): void {

    const settings = this.getAppearanceSettings();

    this.appearanceSettings.set(settings);

    this.applyAppearance(settings);
  }

}