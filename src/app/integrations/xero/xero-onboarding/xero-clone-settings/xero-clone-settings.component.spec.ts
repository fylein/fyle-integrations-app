import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroCloneSettingsComponent } from './xero-clone-settings.component';

xdescribe('XeroCloneSettingsComponent', () => {
  let component: XeroCloneSettingsComponent;
  let fixture: ComponentFixture<XeroCloneSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroCloneSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroCloneSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
