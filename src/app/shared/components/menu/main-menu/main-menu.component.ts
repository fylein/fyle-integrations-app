import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { brandingConfig } from 'src/app/branding/branding-config';
import { AppName } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() moreDropdown = null;

  @Input() appName: AppName;

  @Input() isDropdrownRequired: boolean;

  @Output() refreshDimensionClick = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  constructor() { }

  refreshDimensions() {
    this.refreshDimensionClick.emit(true);
  }

  ngOnInit(): void {
  }

}
