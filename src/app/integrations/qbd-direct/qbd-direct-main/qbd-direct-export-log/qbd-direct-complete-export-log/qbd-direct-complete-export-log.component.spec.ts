import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectCompleteExportLogComponent } from './qbd-direct-complete-export-log.component';

describe('QbdDirectCompleteExportLogComponent', () => {
  let component: QbdDirectCompleteExportLogComponent;
  let fixture: ComponentFixture<QbdDirectCompleteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectCompleteExportLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdDirectCompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
