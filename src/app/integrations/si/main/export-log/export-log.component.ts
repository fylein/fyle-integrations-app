import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { IntacctExportTriggerResponse } from 'src/app/core/models/si/db/export-log.model';
import { Paginator } from 'src/app/core/models/si/misc/paginator.model';
import { PaginatorService } from 'src/app/core/services/si/si-core/paginator.service';

@Component({
  selector: 'app-export-log',
  templateUrl: './export-log.component.html',
  styleUrls: ['./export-log.component.scss']
})
export class ExportLogComponent implements OnInit {

  isLoading: boolean = false;

  totalCount: number;

  limit: number = 10;

  pageNo: number = 0;

  dateOptions: DateFilter[] = [
    {
      dateRange: 'This Month',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    },
    {
      dateRange: 'This Week',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
      endDate: new Date()
    },
    {
      dateRange: 'Today',
      startDate: new Date(),
      endDate: new Date()
    },
    {
      dateRange: new Date().toLocaleDateString(),
      startDate: new Date(),
      endDate: new Date()
    }
  ];

  selectedDateFilter: DateFilter | null = null;

  presentDate = new Date().toLocaleDateString();

  exportLogForm: FormGroup;

  isCalendarVisible: boolean = false;

  isRecordPresent: boolean = false;

  expenseGroups: IntacctExportTriggerResponse;

  emptyExpenseGroup: IntacctExportTriggerResponse;

  skipExport: IntacctExportTriggerResponse;

  emptySkipExportList: IntacctExportTriggerResponse;

  constructor(
    private formBuilder: FormBuilder,
    private paginatorService: PaginatorService

  ) { }

  dropDownWatcher() {
    if (this.exportLogForm.controls.dateRange.value !== this.dateOptions[3].dateRange) {
      this.isCalendarVisible = false;
    }
    this.isCalendarVisible = true;
  }

  showCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendarVisible = true;
  }

  getDates() {
    this.dateOptions[3].dateRange = this.exportLogForm.value.start[0].toLocaleDateString() + '-' + this.exportLogForm.value.start[1].toLocaleDateString();
    this.dateOptions[3].startDate = this.exportLogForm.value.start[0];
    this.dateOptions[3].endDate = this.exportLogForm.value.start[1];
    this.presentDate = this.dateOptions[3].dateRange;
    this.exportLogForm.controls.dateRange.patchValue(this.dateOptions[3]);
    const event = {
      value: this.dateOptions[3]
    };
    // This.dateFilter(event);
  }

  private setupForm(): void {
    this.exportLogForm = this.formBuilder.group({
      searchOption: [''],
      dateRange: [null],
      start: [''],
      end: ['']
    });

    // This.exportLogForm.controls.searchOption.valueChanges.subscribe((searchTerm: string) => {
    //   If (searchTerm) {
    //     This.expenseGroups.filter = searchTerm.trim().toLowerCase();
    //   } else {
    //     This.expenseGroups.filter = '';
    //   }
    // });

    // This.exportLogForm.controls.dateRange.valueChanges.subscribe((dateRange) => {
    //   If (dateRange) {
    //     This.selectedDateFilter = {
    //       StartDate: dateRange.startDate,
    //       EndDate: dateRange.endDate
    //     };

    //     This.trackDateFilter('existing', this.selectedDateFilter);

    //     Const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);
    //     This.getExpenseGroups(paginator);
    //   }
    // });
  }

  private getExpenseGroupsAndSetupPage(): void {
    this.setupForm();

    // This.setupSkipExportForm();

    const paginator: Paginator = this.paginatorService.getPageSize(PaginatorPage.EXPORT_LOG);

    // This.getExpenseGroups(paginator);
  }


  ngOnInit(): void {
    this.getExpenseGroupsAndSetupPage();
  }

}
