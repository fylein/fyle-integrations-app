import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectQwcFileLandingComponent } from './qbd-direct-qwc-file-landing.component';

describe('QbdDirectQwcFileLandingComponent', () => {
  let component: QbdDirectQwcFileLandingComponent;
  let fixture: ComponentFixture<QbdDirectQwcFileLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectQwcFileLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectQwcFileLandingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
