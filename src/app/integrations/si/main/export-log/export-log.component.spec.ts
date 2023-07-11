import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLogComponent } from './export-log.component';

describe('ExportLogComponent', () => {
  let component: ExportLogComponent;
  let fixture: ComponentFixture<ExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
