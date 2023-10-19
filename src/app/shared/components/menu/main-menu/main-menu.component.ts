import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input() activeModules: MenuItem[];

  @Input() activeModule: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

}
