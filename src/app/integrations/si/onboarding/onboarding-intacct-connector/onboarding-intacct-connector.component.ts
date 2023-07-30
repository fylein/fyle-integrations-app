import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { SiSettingsService } from 'src/app/core/services/si/si-settings.service';
import { SiComponent } from '../../si.component';

@Component({
  selector: 'app-onboarding-intacct-connector',
  templateUrl: './onboarding-intacct-connector.component.html',
  styleUrls: ['./onboarding-intacct-connector.component.scss']
})
export class OnboardingIntacctConnectorComponent implements OnInit {

  isLoading: boolean;

  workspaceId: number;

  selectLocationEntity: boolean = false;

  constructor(
    private storageService: StorageService,
    private si: SiComponent,
    private settingsService: SiSettingsService
  ) { }

  isLocationEntity() {
    this.workspaceId = this.storageService.get('si.workspaceId');
    this.settingsService.getSageIntacctCredentials(this.workspaceId).subscribe((res) => {
      if(res) {
        this.selectLocationEntity = true;
      }
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.isLocationEntity();
  }
}
