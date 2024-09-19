import type { OnInit } from '@angular/core';
import { Component, Inject, Input } from '@angular/core';
import type { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss']
})
export class SubMenuComponent implements OnInit {

  @Input() modules: MenuItem[];

  @Input() activeModule: MenuItem;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

}
