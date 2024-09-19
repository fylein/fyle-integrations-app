import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigurationSkipExportComponent } from './configuration-skip-export.component';

xdescribe('ConfigurationSkipExportComponent', () => {
  let component: ConfigurationSkipExportComponent;
  let fixture: ComponentFixture<ConfigurationSkipExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationSkipExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationSkipExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
