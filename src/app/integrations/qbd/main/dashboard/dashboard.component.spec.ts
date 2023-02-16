import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';
import { QbdIifLogsService } from 'src/app/core/services/qbd/qbd-iif-log/qbd-iif-logs.service';

import { DashboardComponent } from './dashboard.component';
import { getQbdAccountingExports, postQbdAccountingExports } from './dashboard.fixture';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service1: any;
  let service2: any;

  beforeEach(async () => {

    service1 = {
      getQbdAccountingExports: () => of(getQbdAccountingExports),
      postQbdAccountingExports: () => of(postQbdAccountingExports)
    };

    service2 = {
      getWorkspaceId: () => '1'
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [ DashboardComponent ],
      providers: [ FormBuilder,
        { provide: QbdIifLogsService, useValue: service1 },
        { provide: QbdWorkspaceService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.offset = 10;
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
    expect(component.getExportTime(getQbdAccountingExports.results[0])).toEqual('18:09');
  });

  it('getDownloadLink function check', () => {
    expect(component.getDownloadLink(getQbdAccountingExports.results[0])).toBeUndefined();
    expect(component.isDownloadLinkReady).toBeTrue();
  });

  it('offsetChanges function check', () => {
    expect(component.offsetChanges(10)).toBeUndefined();
    expect(component.pageNo).toEqual(1);
    expect(component.start).toEqual(0);
    expect(component.end).toEqual(10);
  });

  it('pageChanges function check', () => {
    expect(component.pageChanges(2)).toBeUndefined();
    expect(component.pageNo).toEqual(2);
    expect(component.start).toEqual(10);
    expect(component.end).toEqual(20);
  });

  it('dateFilterChanges function else case', () => {
    component.selectedDateFilter = null;
    expect(component.dateFilterChanges()).toBeUndefined();
  });

  it('dateFilterFn function check', () => {
    expect(component.dateFilterFn({value: component.selectedDateFilter})).toBeUndefined();
  });
});
