import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingSageConnectorComponent } from './onboarding-sage-connector.component';

describe('OnboardingSageConnectorComponent', () => {
  let component: OnboardingSageConnectorComponent;
  let fixture: ComponentFixture<OnboardingSageConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingSageConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingSageConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
