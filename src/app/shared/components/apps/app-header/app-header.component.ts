import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Input() isBambooConnected: boolean = false;

  @Input() isBambooSetupInProgress: boolean;

  @Input() isLoading: boolean;

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Input() showErrorScreen: boolean;

  @Input() hideRefreshIcon: boolean;

  constructor() { }

  syncData(): void {
    this.syncEmployees.emit();
  }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  disconnect(): void {
    this.disconnectBambooHr.emit();
  }

  ngOnInit(): void {
  }

}
