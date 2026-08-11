import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientGrowthChart } from './patient-growth-chart';

describe('PatientGrowthChart', () => {
  let component: PatientGrowthChart;
  let fixture: ComponentFixture<PatientGrowthChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientGrowthChart],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientGrowthChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
