import { Component, Input, OnInit } from '@angular/core';
import { brandingConfig } from 'src/app/branding/branding-config';

@Component({
  selector: 'app-dashboard-token-expired',
  templateUrl: './dashboard-token-expired.component.html',
  styleUrl: './dashboard-token-expired.component.scss'
})
export class DashboardTokenExpiredComponent implements OnInit {

  readonly brandingConfig = brandingConfig;

  @Input() title: string;

  @Input() description: string;

  @Input() buttonText: string;

  @Input() buttonRouterURL: string;

  @Input() buttonColor: string;

  constructor(){
  }

  ngOnInit(): void {

  }

}
