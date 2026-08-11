import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilters } from './report-filters';

describe('ReportFilters', () => {
  let component: ReportFilters;
  let fixture: ComponentFixture<ReportFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
