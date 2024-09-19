import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brandingConfig, brandingContent, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import type { WindowService } from 'src/app/core/services/common/window.service';
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

  readonly brandingContent = brandingContent.common;

  constructor(
    public windowService: WindowService
  ) { }

  refreshDimensions() {
    this.refreshDimension.emit(true);
  }

  ngOnInit(): void {
  }

}
