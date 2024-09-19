import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteDashboardComponent } from './netsuite-dashboard.component';

xdescribe('NetsuiteDashboardComponent', () => {
  let component: NetsuiteDashboardComponent;
  let fixture: ComponentFixture<NetsuiteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
