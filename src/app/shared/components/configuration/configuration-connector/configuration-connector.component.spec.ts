import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigurationConnectorComponent } from './configuration-connector.component';

xdescribe('ConfigurationConnectorComponent', () => {
  let component: ConfigurationConnectorComponent;
  let fixture: ComponentFixture<ConfigurationConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
