import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIntegrationLandingComponent } from './app-landing-page-body.component';

describe('AppIntegrationLandingComponent', () => {
  let component: AppIntegrationLandingComponent;
  let fixture: ComponentFixture<AppIntegrationLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppIntegrationLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppIntegrationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
