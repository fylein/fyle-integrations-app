import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroDashboardComponent } from './xero-dashboard.component';

xdescribe('XeroDashboardComponent', () => {
  let component: XeroDashboardComponent;
  let fixture: ComponentFixture<XeroDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
