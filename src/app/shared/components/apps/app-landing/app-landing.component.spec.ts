import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLandingComponent } from './app-landing.component';

describe('AppLandingComponent', () => {
  let component: AppLandingComponent;
  let fixture: ComponentFixture<AppLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should open help article in new tab', () => {
    spyOn(component.openReadMore, 'emit');

    component.openHelp();
    expect(component.openReadMore.emit).toHaveBeenCalled();
  })
});
