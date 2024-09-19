import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctSkipExportLogComponent } from './intacct-skip-export-log.component';

xdescribe('SkipExportLogComponent', () => {
  let component: IntacctSkipExportLogComponent;
  let fixture: ComponentFixture<IntacctSkipExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctSkipExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctSkipExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
