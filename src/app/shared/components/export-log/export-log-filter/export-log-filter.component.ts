import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { brandingConfig, brandingContent } from 'src/app/branding/branding-config';
import { AccountingExportModel } from 'src/app/core/models/db/accounting-export.model';
import { DateFilter, SelectedDateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';

@Component({
  selector: 'app-export-log-filter',
  templateUrl: './export-log-filter.component.html',
  styleUrls: ['./export-log-filter.component.scss']
})
export class ExportLogFilterComponent implements OnInit {

  @Input() exportLogForm: FormGroup;

  @Input() dateOptions: DateFilter[];

  @Input() isSimpleSearchRequired: boolean = true;

  isSearchFocused: boolean;

  isDateFilterFocused: boolean;

  @Output() handleSimpleSearch = new EventEmitter<any>();

  isCalendarVisible: boolean;

  presentDate = new Date().toLocaleDateString();

  startDate: Date;

  endDate: Date;

  isSelectionStartDate: boolean = true;

  readonly brandingConfig = brandingConfig;

  readonly brandingContent = brandingContent.exportLog;

  constructor() { }

  clearDateFilter(): void {
    this.exportLogForm.controls.start.patchValue('');
  }

  setupSearchWatcher() {
    this.exportLogForm.controls.searchOption.valueChanges.subscribe((value) => {
      this.handleSimpleSearch.emit(value);
    });
  }

  dropDownWatcher() {
    if (this.exportLogForm.controls.dateRange.value !== this.dateOptions[3].dateRange) {
      this.isCalendarVisible = false;
    } else {
      this.isCalendarVisible = true;
    }
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  showCalendar(event: Event) {
    this.isCalendarVisible = true;
    event?.stopPropagation();
  }

  onSelect(event: Date) {
    if (this.isSelectionStartDate) {
      this.startDate = event;
      this.isSelectionStartDate = false;
    } else {
      this.endDate = event;
      this.isSelectionStartDate = true;
    }
  }

  selectPreFilledDate(selectedOption: number): void {
    this.exportLogForm.controls.start.patchValue([this.dateOptions[selectedOption].startDate, this.dateOptions[selectedOption].endDate]);
  }

  ngOnInit(): void {
    this.setupSearchWatcher();
  }

}
