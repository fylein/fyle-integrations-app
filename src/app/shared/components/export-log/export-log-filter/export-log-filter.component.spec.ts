import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ExportLogFilterComponent } from './export-log-filter.component';

xdescribe('ExportLogFilterComponent', () => {
  let component: ExportLogFilterComponent;
  let fixture: ComponentFixture<ExportLogFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
