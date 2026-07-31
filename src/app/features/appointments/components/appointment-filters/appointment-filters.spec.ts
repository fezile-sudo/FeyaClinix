import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentFilters } from './appointment-filters';

describe('AppointmentFilters', () => {
  let component: AppointmentFilters;
  let fixture: ComponentFixture<AppointmentFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
