import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneSettingFieldComponent } from './clone-setting-field.component';

xdescribe('CloneSettingFieldComponent', () => {
  let component: CloneSettingFieldComponent;
  let fixture: ComponentFixture<CloneSettingFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloneSettingFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloneSettingFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
