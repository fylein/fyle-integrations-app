import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GustoConfigurationComponent } from './gusto-configuration.component';

describe('GustoConfigurationComponent', () => {
  let component: GustoConfigurationComponent;
  let fixture: ComponentFixture<GustoConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GustoConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GustoConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
