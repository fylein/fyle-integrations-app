import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboCompleteExportLogComponent } from './qbo-complete-export-log.component';

xdescribe('QboCompleteExportLogComponent', () => {
  let component: QboCompleteExportLogComponent;
  let fixture: ComponentFixture<QboCompleteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboCompleteExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboCompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
