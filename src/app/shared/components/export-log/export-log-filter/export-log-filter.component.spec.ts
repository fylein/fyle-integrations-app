import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogFilterComponent } from './export-log-filter.component';

describe('ExportLogFilterComponent', () => {
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
