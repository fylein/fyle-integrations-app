import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';
import { ExportLogService } from 'src/app/core/services/common/export-log.service';

@Component({
  selector: 'app-export-log-filter',
  templateUrl: './export-log-filter.component.html',
  styleUrls: ['./export-log-filter.component.scss']
})
export class ExportLogFilterComponent implements OnInit {

  @Input() exportLogForm: FormGroup;

  isSearchFocused: boolean;

  isDateFieldFocused: boolean;

  @Output() filterTableChange = new EventEmitter<any>();

  isCalendarVisible: boolean;

  presentDate = new Date().toLocaleDateString();

  dateOptions: DateFilter[] = ExportLogService.getDateOptions();

  constructor() { }

  filterTable(event: any) {
    this.filterTableChange.emit(event);
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
    event.stopPropagation();
    this.isCalendarVisible = true;
  }

  getDates() {
    this.dateOptions[3].dateRange = this.exportLogForm.value.start[0].toLocaleDateString() + '-' + this.exportLogForm.value.start[1].toLocaleDateString();
    this.dateOptions[3].startDate = this.exportLogForm.value.start[0];
    this.dateOptions[3].endDate = this.exportLogForm.value.start[1];
    this.presentDate = this.dateOptions[3].dateRange;
    this.exportLogForm.controls.dateRange.patchValue(this.dateOptions[3]);
  }

  ngOnInit(): void {
  }

}
