import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  pageNumbers: number[] = [10, 50, 100, 200];

  @Input() page: number;

  @Output() offsetChangeEvent = new EventEmitter<number>();

  @Output() pageChangeEvent = new EventEmitter<number>();

  @Input() totalCount: number;

  @Input() pageType:  PaginatorPage;

  @Input() dropDownValue: number = 10;

  totalPages: number;

  PaginatorPage = PaginatorPage;

  constructor() { }

  goToEndPages(targetPage: number) {
    if (targetPage === 1) {
      this.page = 1;
      this.pageChangeEvent.emit(0);
    } else {
      this.page = targetPage;
      const offsetValue = (targetPage-1) * this.dropDownValue;
      this.pageChangeEvent.emit(offsetValue);
    }
  }

  offsetChanges(event:any) {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
    this.offsetChangeEvent.emit(event.value);
  }

  previousPageChange(currentPage: number) {
    this.page = this.page - 1;
    const offsetValue = (currentPage - 2) * this.dropDownValue;
    this.pageChangeEvent.emit(offsetValue);
  }

  nextPageChange(currentPage: number) {
    this.page = this.page + 1;
    const offsetValue = currentPage * this.dropDownValue;
    this.pageChangeEvent.emit(offsetValue);
  }

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
  }

}
