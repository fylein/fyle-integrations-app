import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TravelperkPaymentProfileSettingsComponent } from './travelperk-payment-profile-settings.component';

xdescribe('TravelperkPaymentProfileSettingsComponent', () => {
  let component: TravelperkPaymentProfileSettingsComponent;
  let fixture: ComponentFixture<TravelperkPaymentProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkPaymentProfileSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkPaymentProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
