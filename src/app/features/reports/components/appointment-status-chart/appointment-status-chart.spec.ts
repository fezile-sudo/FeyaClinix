import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStatusChart } from './appointment-status-chart';

describe('AppointmentStatusChart', () => {
  let component: AppointmentStatusChart;
  let fixture: ComponentFixture<AppointmentStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentStatusChart],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentStatusChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
