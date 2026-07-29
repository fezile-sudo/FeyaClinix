import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutNavbar } from './layout-navbar';

describe('LayoutNavbar', () => {
  let component: LayoutNavbar;
  let fixture: ComponentFixture<LayoutNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
