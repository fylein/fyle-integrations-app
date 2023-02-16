import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  listItems:number[] = [10, 50, 100, 200];

  page:  number = 1;

  @Output() offsetChangeEvent = new EventEmitter<number>();

  @Output() pageChangeEvent = new EventEmitter<number>();

  @Input() totalCount: number;

  dropDownValue: number = 10;

  totalPages: number;

  constructor() { }

  offsetChanges(event:any) {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
    this.offsetChangeEvent.emit(event.value);
  }

  previousPageChange(currentPage: number) {
    this.page = this.page-1;
    this.pageChangeEvent.emit(currentPage-1);
  }

  nextPageChange(currentPage: number) {
    this.page = this.page+1;
    this.pageChangeEvent.emit(currentPage+1);
  }

  ngOnInit(): void {
    this.totalPages = Math.ceil(this.totalCount/this.dropDownValue);
  }

}
