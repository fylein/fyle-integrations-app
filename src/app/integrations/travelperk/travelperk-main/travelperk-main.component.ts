import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-travelperk-main',
    templateUrl: './travelperk-main.component.html',
    styleUrls: ['./travelperk-main.component.scss'],
    standalone: false
})
export class TravelperkMainComponent implements OnInit {

  appName: AppName = AppName.TRAVELPERK;

  modules: MenuItem[];

  isConnectionInProgress: boolean = false;

  constructor(
    private travelperkService: TravelperkService,
    private toastService: IntegrationsToastService,
    private router: Router,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.modules = [
      {label: this.translocoService.translate('travelperkMain.configurationLabel'), routerLink: '/integrations/travelperk/main/configuration'}
    ];
  }

  disconnect(): void {
    this.isConnectionInProgress = true;
    this.travelperkService.disconnect().subscribe(() => {
      this.isConnectionInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('travelperkMain.disconnectSuccess'));
      this.router.navigate(['/integrations/travelperk/onboarding/landing']);
    });
  }

  refreshDimentions():void {
    this.travelperkService.syncCategories().subscribe();
    this.travelperkService.syncPaymentProfile().subscribe;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('travelperkMain.syncDataDimensions'));
  }
}
