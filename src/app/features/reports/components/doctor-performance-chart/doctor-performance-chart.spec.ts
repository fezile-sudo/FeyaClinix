import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPerformanceChart } from './doctor-performance-chart';

describe('DoctorPerformanceChart', () => {
  let component: DoctorPerformanceChart;
  let fixture: ComponentFixture<DoctorPerformanceChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPerformanceChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorPerformanceChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
