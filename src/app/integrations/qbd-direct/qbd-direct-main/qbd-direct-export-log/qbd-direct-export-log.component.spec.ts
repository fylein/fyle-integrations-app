import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectExportLogComponent } from './qbd-direct-export-log.component';

describe('QbdDirectExportLogComponent', () => {
  let component: QbdDirectExportLogComponent;
  let fixture: ComponentFixture<QbdDirectExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectExportLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdDirectExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
