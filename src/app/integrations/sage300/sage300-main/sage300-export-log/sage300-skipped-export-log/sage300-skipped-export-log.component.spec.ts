import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300SkippedExportLogComponent } from './sage300-skipped-export-log.component';

describe('Sage300SkippedExportLogComponent', () => {
  let component: Sage300SkippedExportLogComponent;
  let fixture: ComponentFixture<Sage300SkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300SkippedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300SkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
