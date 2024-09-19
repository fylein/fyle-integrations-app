import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboCloneSettingsComponent } from './qbo-clone-settings.component';

xdescribe('QboCloneSettingsComponent', () => {
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
