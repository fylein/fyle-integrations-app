import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { appName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() moreDropdown = null;

  @Input() appName: appName;

  @Input() isDropdrownRequired: boolean;

  @Output() onRefreshDimensionClick = new EventEmitter<boolean>();

  constructor() { }

  refreshDimensions() {
    this.onRefreshDimensionClick.emit(true);
  }

  ngOnInit(): void {
  }

}
