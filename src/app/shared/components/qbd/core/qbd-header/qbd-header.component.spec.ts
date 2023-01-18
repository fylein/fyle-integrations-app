import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdHeaderComponent } from './qbd-header.component';

describe('PostOnboardingHeaderComponent', () => {
  let component: QbdHeaderComponent;
  let fixture: ComponentFixture<QbdHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
