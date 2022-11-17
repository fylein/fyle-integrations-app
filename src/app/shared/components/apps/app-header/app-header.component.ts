import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Output() openDialog = new EventEmitter<void>();

  constructor() { }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  ngOnInit(): void {
  }

}
