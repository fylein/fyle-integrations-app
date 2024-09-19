import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteConfigurationComponent } from './netsuite-configuration.component';

xdescribe('NetsuiteConfigurationComponent', () => {
  let component: NetsuiteConfigurationComponent;
  let fixture: ComponentFixture<NetsuiteConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
