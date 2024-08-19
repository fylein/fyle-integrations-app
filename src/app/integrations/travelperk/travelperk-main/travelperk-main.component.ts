import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppName, ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';

@Component({
  selector: 'app-travelperk-main',
  templateUrl: './travelperk-main.component.html',
  styleUrls: ['./travelperk-main.component.scss']
})
export class TravelperkMainComponent implements OnInit {

  appName: AppName = AppName.TRAVELPERK;

  modules: MenuItem[] = [
    {label: 'Configuration', routerLink: '/integrations/travelperk/main/configuration'}
  ];

  activeModule: MenuItem;

  isConnectionInProgress: boolean = false;

  constructor(
    private travelperkService: TravelperkService,
    private toastService: IntegrationsToastService,
    private router: Router
  ) { }

  disconnect(): void {
    this.isConnectionInProgress = true;
    this.travelperkService.disconnect().subscribe(() => {
      this.isConnectionInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Disconnected Travelperk successfully');
      this.router.navigate(['/integrations/travelperk/onboarding/landing']);
    });
  }

  refreshDimentions():void {
    this.travelperkService.syncCategories().subscribe();
    this.travelperkService.syncPaymentProfile().subscribe;
    this.toastService.displayToastMessage(ToastSeverity.SUCCESS, 'Syncing data dimensions from TravelPerk');
  }

  private setupPage() {
    this.activeModule = this.modules[0];
    this.router.navigateByUrl(this.modules[0].routerLink);
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
