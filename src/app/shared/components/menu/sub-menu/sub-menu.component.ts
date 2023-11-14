import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeModule: MenuItem;

  constructor() { }

  ngOnInit(): void {
  }

}
