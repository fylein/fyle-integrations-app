import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationConfirmationDialogComponent } from './configuration-confirmation-dialog.component';

xdescribe('ConfigurationConfirmationDialogComponent', () => {
  let component: ConfigurationConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfigurationConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
