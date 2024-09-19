import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboExportLogComponent } from './qbo-export-log.component';

xdescribe('QboExportLogComponent', () => {
  let component: QboExportLogComponent;
  let fixture: ComponentFixture<QboExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
