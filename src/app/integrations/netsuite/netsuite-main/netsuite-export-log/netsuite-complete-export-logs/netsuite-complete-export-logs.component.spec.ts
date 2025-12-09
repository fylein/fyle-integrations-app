import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteCompleteExportLogsComponent } from './netsuite-complete-export-logs.component';

xdescribe('NetsuiteCompleteExportLogsComponent', () => {
  let component: NetsuiteCompleteExportLogsComponent;
  let fixture: ComponentFixture<NetsuiteCompleteExportLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteCompleteExportLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteCompleteExportLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
