import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ExportLogChildTableDialogComponent } from './export-log-child-table-dialog.component';



xdescribe('ExportLogChildTableComponent', () => {
  let component: ExportLogChildTableDialogComponent;
  let fixture: ComponentFixture<ExportLogChildTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportLogChildTableDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLogChildTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
