import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() moreDropdown = null;

  @Input() appName: string;

  @Input() isDropdrownRequired: boolean;

  @Output() refreshDimension = new EventEmitter<boolean>();

  constructor() { }

  refreshDimensions() {
    this.refreshDimension.emit(true);
  }

  ngOnInit(): void {
  }

}
