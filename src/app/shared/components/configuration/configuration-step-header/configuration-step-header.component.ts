import { Component, Input, OnInit } from '@angular/core';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WindowService } from 'src/app/core/services/common/window.service';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';

@Component({
  selector: 'app-configuration-step-header',
  templateUrl: './configuration-step-header.component.html',
  styleUrls: ['./configuration-step-header.component.scss']
})
export class ConfigurationStepHeaderComponent implements OnInit {

  @Input() headerText: string;

  @Input() contentText: string;

  @Input() redirectLink: string;

  @Input() showSyncButton: boolean;

  constructor(
    private toastService: IntegrationsToastService,
    public windowService: WindowService,
    private mappingsService: SiMappingsService
  ) { }

  refreshDimensions() {
    this.mappingsService.refreshSageIntacctDimensions().subscribe();
    this.mappingsService.refreshFyleDimensions().subscribe();
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Refreshing data dimensions from Sage Intacct');
  }

  ngOnInit(): void {
  }

}
