import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingStyle } from 'src/app/branding/branding-config';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
    standalone: false
})
export class PaginatorComponent implements OnInit {

  pageNumbers: number[] = [10, 50, 100, 200];

  @Input() page: number;

  @Output() pageSizeChangeEvent = new EventEmitter<number>();

  @Output() pageOffsetChangeEvent = new EventEmitter<number>();

  @Input() totalCount: number;

  @Input() pageType:  PaginatorPage;

  @Input() dropDownValue: number = 10;

  readonly brandingConfig = brandingConfig;

  readonly brandingStyle = brandingStyle;

  totalPages: number;

  PaginatorPage = PaginatorPage;

  constructor() { }

  navigateToPage(targetPage: number) {
    if (targetPage === 1) {
      this.page = 1;
      this.pageOffsetChangeEvent.emit(0);
    } else {
      this.page = targetPage;
      const offsetValue = (targetPage-1) * this.dropDownValue;
      this.pageOffsetChangeEvent.emit(offsetValue);
    }
  }

  pageSizeChanges(event:any) {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
    this.pageSizeChangeEvent.emit(event.value);
  }

  previousPageChange(currentPage: number) {
    this.page = this.page - 1;
    const offsetValue = (currentPage - 2) * this.dropDownValue;
    this.pageOffsetChangeEvent.emit(offsetValue);
  }

  nextPageChange(currentPage: number) {
    this.page = this.page + 1;
    const offsetValue = currentPage * this.dropDownValue;
    this.pageOffsetChangeEvent.emit(offsetValue);
  }

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
  }

}
