import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DateFilter } from 'src/app/core/models/qbd/misc/date-filter.model';

@Component({
  selector: 'app-export-log-filter',
  templateUrl: './export-log-filter.component.html',
  styleUrls: ['./export-log-filter.component.scss']
})
export class ExportLogFilterComponent implements OnInit {

  @Input() exportLogForm: FormGroup;

  @Input() isSearchFocused: boolean;

  @Input() isDateFieldFocused: boolean;

  @Output() filterTableChange = new EventEmitter<any>();

  isCalendarVisible: boolean;

  presentDate = new Date().toLocaleDateString();

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

  removeFilter(formField: AbstractControl, event?: Event) {
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
