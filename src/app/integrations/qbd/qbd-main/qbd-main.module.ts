import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainRoutingModule } from './qbd-main-routing.module';
import { QbdConfigurationComponent } from './qbd-configuration/qbd-configuration.component';
import { QbdDashboardComponent } from './qbd-dashboard/qbd-dashboard.component';
import { QbdMappingComponent } from './qbd-mapping/qbd-mapping.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { IntegrationsSpotlightComponent } from './integrations-spotlight/integrations-spotlight.component';

@NgModule({
  declarations: [
    QbdConfigurationComponent,
    QbdDashboardComponent,
    QbdMappingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' }),
    MainRoutingModule,
    IntegrationsSpotlightComponent
  ]
})
export class QbdMainModule { }
