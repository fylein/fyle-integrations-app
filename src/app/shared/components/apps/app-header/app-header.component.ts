import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BambooHRConfiguration } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Output() openDialog = new EventEmitter<void>();

  @Output() disconnectBambooHr = new EventEmitter<void>();

  @Output() syncEmployees = new EventEmitter<void>();

  @Input() isIntegrationConnected: boolean = false;

  @Input() isIntegrationSetupInProgress: boolean;

  @Input() appName: string;

  @Input() appDescription: string;

  @Input() isLoading: boolean;

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Input() showErrorScreen: boolean;

  @Input() hideRefreshIcon: boolean;

  constructor(
    private router: Router
  ) { }

  syncData(): void {
    this.syncEmployees.emit();
  }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  disconnect(): void {
    this.disconnectBambooHr.emit();
  }

  connectQBD(): void {
    this.router.navigate(['/integrations/qbd/onboarding/export_settings']);
  }

  ngOnInit(): void {
  }

}
