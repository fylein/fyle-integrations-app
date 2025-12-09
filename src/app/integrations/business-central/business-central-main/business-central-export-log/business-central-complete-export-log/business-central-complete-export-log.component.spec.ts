import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralCompleteExportLogComponent } from './business-central-complete-export-log.component';

xdescribe('BusinessCentralCompleteExportLogComponent', () => {
  let component: BusinessCentralCompleteExportLogComponent;
  let fixture: ComponentFixture<BusinessCentralCompleteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessCentralCompleteExportLogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCentralCompleteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
