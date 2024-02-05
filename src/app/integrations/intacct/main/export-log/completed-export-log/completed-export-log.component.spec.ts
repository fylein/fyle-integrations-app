import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedExportLogComponent } from './completed-export-log.component';

describe('CompletedExportLogComponent', () => {
  let component: CompletedExportLogComponent;
  let fixture: ComponentFixture<CompletedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
