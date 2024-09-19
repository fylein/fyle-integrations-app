import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigurationInfoLabelComponent } from './configuration-info-label.component';

xdescribe('ConfigurationInfoLabelComponent', () => {
  let component: ConfigurationInfoLabelComponent;
  let fixture: ComponentFixture<ConfigurationInfoLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationInfoLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationInfoLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
