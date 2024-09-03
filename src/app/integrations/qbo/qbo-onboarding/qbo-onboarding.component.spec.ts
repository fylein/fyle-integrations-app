import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QboOnboardingComponent } from './qbo-onboarding.component';
import { brandingFeatureConfig } from 'src/app/branding/branding-config';

describe('QboOnboardingComponent', () => {
  let component: QboOnboardingComponent;
  let fixture: ComponentFixture<QboOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOnboardingComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize brandingFeatureConfig', () => {
    expect(component.brandingFeatureConfig).toBe(brandingFeatureConfig);
  });

  it('should call ngOnInit', () => {
    const ngOnInitSpy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(ngOnInitSpy).toHaveBeenCalled();
  });
});