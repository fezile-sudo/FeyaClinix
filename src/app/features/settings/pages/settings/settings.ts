import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService, ProfileSettings } from '../../services/profile.service';
import { SettingsService, GeneralSettings } from '../../services/settings.service';
import { NotificationService, NotificationSettings } from '../../services/notification.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppearanceService, AppearanceSettings } from '../../services/appearance.service';
import { PreferencesService, PreferenceSettings } from '../../services/preferences.service';

@Component({
  selector: 'app-settings',

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],

  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {

  private fb = inject(FormBuilder);

  private settingsService = inject(SettingsService);

  private snackBar = inject(MatSnackBar);

  private profileService = inject(ProfileService);

  private notificationService = inject(NotificationService);

  private appearanceService = inject(AppearanceService);

  private preferencesService = inject(PreferencesService);


    activeSection:
    'general'
    | 'profile'
    | 'notifications'
    | 'appearance'
    | 'preferences' = 'general';


  setActiveSection(
    section:
      'general'
      | 'profile'
      | 'notifications'
      | 'appearance'
      | 'preferences'
  ): void {
    this.activeSection = section;
  }


  generalSettingsForm = this.fb.nonNullable.group({

    hospitalName: [''],

    contactEmail: [''],

    phoneNumber: [''],

    address: [''],

    city: [''],

    country: [''],

    timezone: [''],

    dateFormat: ['']

  });

  profileForm = this.fb.nonNullable.group({

      firstName: [''],

      lastName: [''],

      email: [''],

      phone: [''],

      role: [''],

      department: ['']

    });

   notificationForm = this.fb.nonNullable.group({

      newAppointments: [true],

      appointmentChanges: [true],

      appointmentCancellations: [true],

      appointmentReminders: [true],

      doctorAvailability: [false],

      systemNotifications: [true]

    }); 


    appearanceForm = this.fb.nonNullable.group({

        theme: ['light' as 'light' | 'dark'],

        sidebar: ['expanded' as 'expanded' | 'compact'],

        colorScheme: ['blue' as 'blue' | 'teal' | 'purple']

      });

      preferencesForm = this.fb.nonNullable.group({

        calendarView: ['month' as 'month' | 'week' ],

        weekStartsOn: ['monday' as 'sunday' | 'monday'],

        showWeekends: [true],

        autoRefreshDashboard: [false],

        itemsPerPage: [10]

      });


    ngOnInit(): void {

      const settings = this.settingsService.getGeneralSettings();

      this.generalSettingsForm.patchValue(settings);


      const profile = this.profileService.getProfile();

      this.profileForm.patchValue(profile);


      const notifications = this.notificationService.getNotificationSettings();

      this.notificationForm.patchValue(notifications);

      const appearance = this.appearanceService.getAppearanceSettings();

      this.appearanceForm.patchValue(appearance);

      this.appearanceService.initializeAppearance();

      const preferences =
      this.preferencesService.getPreferences();

      this.preferencesForm.patchValue(preferences);

    }


  saveSettings(): void {

  const settings: GeneralSettings =
    this.generalSettingsForm.getRawValue();

      this.settingsService.saveGeneralSettings(settings);

      this.snackBar.open(
        'Settings saved successfully!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    }

   saveProfile(): void {

  const profile: ProfileSettings = this.profileForm.getRawValue();

      this.profileService.saveProfile(profile);

      this.snackBar.open(
        'Profile saved successfully!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    } 

    saveNotifications(): void {

      const notifications: NotificationSettings = this.notificationForm.getRawValue();

      this.notificationService.saveNotificationSettings(notifications);

      this.snackBar.open(
        'Notification settings saved successfully!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    }

    cancelNotificationChanges(): void {

      const notifications = this.notificationService.getNotificationSettings();

      this.notificationForm.patchValue(notifications);

    }

   cancelProfileChanges(): void {

    const profile = this.profileService.getProfile();

    this.profileForm.patchValue(profile);

    } 


  cancelChanges(): void {

    const settings = this.settingsService.getGeneralSettings();

    this.generalSettingsForm.patchValue(settings);

  }

  saveAppearance(): void {

  const appearance: AppearanceSettings = this.appearanceForm.getRawValue();

    this.appearanceService.saveAppearanceSettings(appearance);

    this.snackBar.open(
      'Appearance settings saved successfully!',
      'Close',
      {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    );

  }

 cancelAppearanceChanges(): void {

    const appearance = this.appearanceService.getAppearanceSettings();

    this.appearanceForm.patchValue(appearance);

  } 

 savePreferences(): void {

  const preferences: PreferenceSettings = this.preferencesForm.getRawValue();

  this.preferencesService.savePreferences( preferences);

  this.snackBar.open(
    'Preferences saved successfully!',
    'Close',
    {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    }
  );

}

cancelPreferenceChanges(): void {

  const preferences = this.preferencesService.getPreferences();

  this.preferencesForm.patchValue(preferences);

}

}
