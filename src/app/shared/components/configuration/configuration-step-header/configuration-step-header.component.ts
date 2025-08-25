import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { brandingConfig, brandingFeatureConfig, brandingStyle } from 'src/app/branding/branding-config';
import { AppName, ButtonSize, ButtonType, ToastSeverity } from 'src/app/core/models/enum/enum.model';
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

  @Input() appName: string;

  @Output() refreshDimension = new EventEmitter<boolean>();

  readonly brandingConfig = brandingConfig;

  brandingFeatureConfig = brandingFeatureConfig;

  readonly brandingStyle = brandingStyle;

  buttonType = ButtonType;

  buttonSize = ButtonSize;

  constructor(
    public windowService: WindowService
  ) { }

  refreshDimensions() {
    this.refreshDimension.emit(true);
  }

  ngOnInit(): void {
  }

}
