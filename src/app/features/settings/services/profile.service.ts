import { Injectable, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';

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

  private readonly authService = inject(AuthService);

  private readonly storagePrefix = 'feyaClinicProfile_';

  getProfile(): ProfileSettings {

    const user = this.authService.currentUser();

    if (!user) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: ''
      };
    }

    const storageKey = `${this.storagePrefix}${user.id}`;

    const savedProfile = localStorage.getItem(storageKey);

    const savedData = savedProfile? JSON.parse(savedProfile) : {};

    const name = user.name.trim();

      let firstName = '';
      let lastName = '';

      if (name.startsWith('Dr. ')) {

        const nameWithoutTitle = name.substring(4).trim();

        const nameParts = nameWithoutTitle.split(' ');

        firstName = nameParts.shift() ?? '';
        lastName = nameParts.join(' ');

      } else {

        const nameParts = name.split(' ');

        firstName = nameParts.shift() ?? '';
        lastName = nameParts.join(' ');
      }


    return {
      firstName,
      lastName,
      email: user.email,
      phone: savedData.phone ?? '',
      role: user.role,
      department: savedData.department ?? ''
    };
  }

  saveProfile(profile: ProfileSettings): void {

    const user = this.authService.currentUser();

    if (!user) {
      return;
    }

    const storageKey = `${this.storagePrefix}${user.id}`;

    const profileData = {
      phone: profile.phone,
      department: profile.department
    };

    localStorage.setItem(
      storageKey,
      JSON.stringify(profileData)
    );
  }
}
