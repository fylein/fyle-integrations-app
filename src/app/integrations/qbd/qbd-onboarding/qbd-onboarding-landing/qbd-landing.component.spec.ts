import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdLandingComponent } from './qbd-landing.component';

describe('QbdLandingComponent', () => {
  let component: QbdLandingComponent;
  let fixture: ComponentFixture<QbdLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
