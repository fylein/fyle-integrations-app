import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { EventsService } from './core/services/common/events.service';
import { QboAuthService } from './core/services/qbo/qbo-core/qbo-auth.service';
import { Token } from 'src/app/core/models/misc/token.model';
import { IframeOrigin, InAppIntegration, IntegrationAppKey } from './core/models/enum/enum.model';
import { SiAuthService } from './core/services/si/si-core/si-auth.service';
import { XeroAuthService } from './core/services/xero/xero-core/xero-auth.service';
import { NetsuiteAuthService } from './core/services/netsuite/netsuite-core/netsuite-auth.service';
import { brandingFeatureConfig } from './branding/branding-config';
import { AuthService } from './core/services/common/auth.service';
import { Router } from '@angular/router';
import { IntegrationsService } from './core/services/common/integrations.service';
import { RedirectUriStorageService } from './core/services/misc/redirect-uri-storage.service';
import { Tokens } from './core/models/misc/integration-tokens-map';
import { IframeOriginStorageService } from './core/services/misc/iframe-origin-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private eventsService: EventsService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private iframeOriginStorageService: IframeOriginStorageService
  ) { }

  closeToast(): void {
    this.messageService.clear('');
  }

  ngOnInit(): void {
    this.eventsService.receiveEvent();
    this.primengConfig.ripple = true;
  }
}
