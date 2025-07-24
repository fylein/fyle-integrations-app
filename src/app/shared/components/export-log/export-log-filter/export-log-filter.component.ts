import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { brandingConfig } from 'src/app/branding/branding-config';
import { DateFilter } from 'src/app/core/models/qbd/misc/qbd-date-filter.model';

@Component({
    selector: 'app-export-log-filter',
    templateUrl: './export-log-filter.component.html',
    styleUrls: ['./export-log-filter.component.scss'],
    standalone: false
})
export class ExportLogFilterComponent implements OnInit, OnDestroy {

  @Input() exportLogForm: FormGroup;

  @Input() dateOptions: DateFilter[];

  @Input() isSimpleSearchRequired: boolean = true;

  isSearchFocused: boolean;

  isDateFilterFocused: boolean;

  @Output() handleSimpleSearch = new EventEmitter<any>();

  isCalendarVisible: boolean;

  @Input() hideCalendar: boolean;

  presentDate = new Date().toLocaleDateString();

  startDate: Date;

  endDate: Date;

  isSelectionStartDate: boolean = true;

  @ViewChild('calendar') calendar: Calendar;


  @ViewChild('calendarContainer', { static: true }) calendarContainer: any;

  private observer: MutationObserver | undefined;

  readonly brandingConfig = brandingConfig;

  constructor(private renderer: Renderer2) { }

  clearDateFilter(): void {
    this.exportLogForm.controls.start.patchValue('');
  }

  setupSearchWatcher() {
    this.exportLogForm.controls.searchOption.valueChanges.subscribe((value) => {
      this.handleSimpleSearch.emit(value);
    });
  }

  removeFilter(formField: AbstractControl) {
    (formField as FormGroup).reset();
    event?.stopPropagation();
  }

  showCalendar(event: Event) {
    this.isCalendarVisible = true;
    this.calendar.inputfieldViewChild?.nativeElement.focus();
    setTimeout(() => {
      this.calendar.showOverlay();
      const overlayElement = document.querySelector('.p-datepicker-mask');
      if (overlayElement) {
        this.renderer.removeClass(overlayElement, 'p-component-overlay');
        this.renderer.setStyle(overlayElement, 'background-color', 'transparent');
        this.renderer.setStyle(overlayElement, 'pointer-events', 'none');
      }
    }, 0);
    event?.stopPropagation();
  }

  onSelect(event: Date) {
    if (this.isSelectionStartDate) {
      this.startDate = event;
      this.isSelectionStartDate = false;
    } else {
      this.hideCalendar = true;
      this.endDate = event;
      this.isSelectionStartDate = true;
      setTimeout(() => {
        this.hideCalendar = false;
      }, 10);
    }
  }

  selectPreFilledDate(selectedOption: number): void {
    this.exportLogForm.controls.start.patchValue([this.dateOptions[selectedOption].startDate, this.dateOptions[selectedOption].endDate]);
  }

  handleClickOutside(event: Event) {
    if (!this.calendarContainer) {
      this.isCalendarVisible = false;
      this.isDateFilterFocused = false;
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnInit(): void {
    this.setupSearchWatcher();
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

}
