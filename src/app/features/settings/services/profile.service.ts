import { Injectable } from '@angular/core';

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly storageKey = 'feyaClinicProfile';

  private defaultProfile: ProfileSettings = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@feyaclinic.com',
    phone: '',
    role: 'Administrator',
    department: 'Administration'
  };


  getProfile(): ProfileSettings {

    const savedProfile = localStorage.getItem(this.storageKey);

    if (savedProfile) {
      return JSON.parse(savedProfile);
    }

    return this.defaultProfile;
  }


  saveProfile(profile: ProfileSettings): void {

    localStorage.setItem(this.storageKey, JSON.stringify(profile));

  }

}