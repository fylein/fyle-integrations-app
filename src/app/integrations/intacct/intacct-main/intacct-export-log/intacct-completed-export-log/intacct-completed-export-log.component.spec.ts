import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctCompletedExportLogComponent } from './intacct-completed-export-log.component';

xdescribe('IntacctCompletedExportLogComponent', () => {
  let component: IntacctCompletedExportLogComponent;
  let fixture: ComponentFixture<IntacctCompletedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctCompletedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctCompletedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
