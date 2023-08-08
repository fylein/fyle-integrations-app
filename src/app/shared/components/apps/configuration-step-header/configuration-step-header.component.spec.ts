import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepHeaderComponent } from './configuration-step-header.component';

describe('ConfigurationStepHeaderComponent', () => {
  let component: ConfigurationStepHeaderComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStepHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationStepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
