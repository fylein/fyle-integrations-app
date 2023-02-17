import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';

import { DashboardComponent } from './dashboard.component';
import { getQbdAccountingExports, postQbdAccountingExports } from './dashboard.fixture';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service1: any;

  beforeEach(async () => {

    service1 = {
      getQbdAccountingExports: () => of(getQbdAccountingExports),
      postQbdAccountingExports: () => of(postQbdAccountingExports),
      postQbdTriggerExport: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ DashboardComponent ],
      providers: [ FormBuilder,
        { provide: QbdIifLogsService, useValue: service1 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.limit = 10;
    component.selectedDateFilter = {
      dateRange: "This Month",
      endDate: new Date(),
      startDate: new Date('Wed Feb 01 2023')
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getExportTime function check', () => {
    expect(component.getExportTime(getQbdAccountingExports.results[0])).toEqual(new Date("2023-02-09").toTimeString().slice(0, 5));
  });

  it('getDownloadLink function check', () => {
    expect(component.getDownloadLink(getQbdAccountingExports.results[0])).toBeUndefined();
    expect(component.downloadingExportId[0]).toEqual(0);
  });

  it('offsetChanges function check', () => {
    expect(component.offsetChanges(10)).toBeUndefined();
    expect(component.pageNo).toEqual(1);
  });

  it('pageChanges function check', () => {
    expect(component.pageChanges(2)).toBeUndefined();
    expect(component.pageNo).toEqual(2);
  });

  it('dateFilterFn function check', () => {
    expect(component.dateFilterFn({value: component.selectedDateFilter})).toBeUndefined();
  });

  it('getTypeString function check', () => {
    expect(component.getTypeString('Export_Reimbesable_Expense')).toEqual('Reimbesable Expense');
  });

  it('triggerExports function check', () => {
    expect(component.triggerExports()).toBeUndefined();
  });
});
