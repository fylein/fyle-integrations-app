import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogTableComponent } from './export-log-table.component';

describe('ExportLogTableComponent', () => {
  let component: ExportLogTableComponent;
  let fixture: ComponentFixture<ExportLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
