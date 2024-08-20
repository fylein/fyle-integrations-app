import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboCloneSettingsComponent } from './qbo-clone-settings.component';

describe('QboCloneSettingsComponent', () => {
 let component: QboCloneSettingsComponent;
 let fixture: ComponentFixture<QboCloneSettingsComponent>;

 beforeEach(async () => {
   await TestBed.configureTestingModule({
     declarations: [ QboCloneSettingsComponent ]
   })
   .compileComponents();

   fixture = TestBed.createComponent(QboCloneSettingsComponent);
   component = fixture.componentInstance;
   fixture.detectChanges();
 });

 it('should create', () => {
   expect(component).toBeTruthy();
 });
});
