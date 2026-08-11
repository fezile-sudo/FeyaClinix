import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryCards } from './report-summary-cards';

describe('ReportSummaryCards', () => {
  let component: ReportSummaryCards;
  let fixture: ComponentFixture<ReportSummaryCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryCards],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportSummaryCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
