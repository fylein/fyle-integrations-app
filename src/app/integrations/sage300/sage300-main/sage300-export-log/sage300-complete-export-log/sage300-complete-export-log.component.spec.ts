import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Sage300CompleteExportLogComponent } from './sage300-complete-export-log.component';



xdescribe('Sage300CompleteExportLogComponent', () => {
  let component: Sage300CompleteExportLogComponent;
  let fixture: ComponentFixture<Sage300CompleteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300CompleteExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300CompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
