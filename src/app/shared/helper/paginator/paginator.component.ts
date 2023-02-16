import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  listItems:number[] = [10, 50, 100, 200];

  constructor() { }

  ngOnInit(): void {
  }

}
