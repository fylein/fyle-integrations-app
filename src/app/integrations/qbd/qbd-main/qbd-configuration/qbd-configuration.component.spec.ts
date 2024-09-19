import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QbdConfigurationComponent } from './qbd-configuration.component';

describe('QbdConfigurationComponent', () => {
  let component: QbdConfigurationComponent;
  let fixture: ComponentFixture<QbdConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
