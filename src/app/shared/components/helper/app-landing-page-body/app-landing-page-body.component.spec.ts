import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLandingPageBodyComponent } from './app-landing-page-body.component';

describe('AppLandingPageBodyComponent', () => {
  let component: AppLandingPageBodyComponent;
  let fixture: ComponentFixture<AppLandingPageBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLandingPageBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLandingPageBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
