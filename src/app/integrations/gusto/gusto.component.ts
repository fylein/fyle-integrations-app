import { Component, OnInit } from '@angular/core';
import { RedirectLink } from 'src/app/core/models/enum/enum.model';

@Component({
  selector: 'app-gusto',
  templateUrl: './gusto.component.html',
  styleUrls: ['./gusto.component.scss']
})
export class GustoComponent implements OnInit {

  showDialog: boolean;

  isBambooConnected: boolean = false;

  isBambooConnectionInProgress: boolean = false;

  isBambooSetupInProgress: boolean;

  isLoading: boolean = false;

  hideRefreshIcon: boolean;

  isConfigurationSaveInProgress: boolean;

  RedirectLink = RedirectLink;

  showErrorScreen: boolean;

  bambooHrConfiguration: any;

  constructor() { }

  syncEmployees(): void {

  }

  disconnectBambooHr(): void {

  }

  ngOnInit(): void {
  }

}
