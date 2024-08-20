import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboImportSettingsComponent } from './qbo-import-settings.component';

describe('QboImportSettingsComponent', () => {
 let component: QboImportSettingsComponent;
 let fixture: ComponentFixture<QboImportSettingsComponent>;

 beforeEach(async () => {
   await TestBed.configureTestingModule({
     declarations: [ QboImportSettingsComponent ]
   })
   .compileComponents();

   fixture = TestBed.createComponent(QboImportSettingsComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
