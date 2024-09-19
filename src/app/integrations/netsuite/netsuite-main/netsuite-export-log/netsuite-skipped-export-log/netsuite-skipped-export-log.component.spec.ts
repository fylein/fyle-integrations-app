import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteSkippedExportLogComponent } from './netsuite-skipped-export-log.component';

xdescribe('NetsuiteSkippedExportLogComponent', () => {
  let component: NetsuiteSkippedExportLogComponent;
  let fixture: ComponentFixture<NetsuiteSkippedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteSkippedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteSkippedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
