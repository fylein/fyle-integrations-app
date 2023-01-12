import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepFooterComponent } from './configuration-step-footer.component';

describe('ConfigurationStepFooterComponent', () => {
  let component: ConfigurationStepFooterComponent;
  let fixture: ComponentFixture<ConfigurationStepFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStepFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationStepFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
