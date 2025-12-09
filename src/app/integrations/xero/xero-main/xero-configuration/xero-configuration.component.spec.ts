import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroConfigurationComponent } from './xero-configuration.component';

xdescribe('XeroConfigurationComponent', () => {
  let component: XeroConfigurationComponent;
  let fixture: ComponentFixture<XeroConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XeroConfigurationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XeroConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
