import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiComponent } from './si.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
// Import { OnboardingAdvancedSettingComponent } from './onboarding/onboarding-advanced-setting/onboarding-advanced-setting.component';
// Import { OnboardingDoneComponent } from './onboarding/onboarding-done/onboarding-done.component';
// Import { OnboardingExportSettingComponent } from './onboarding/onboarding-export-setting/onboarding-export-setting.component';
// Import { ConfigurationComponent } from './main/configuration/configuration.component';
// Import { DashboardComponent } from './main/dashboard/dashboard.component';
// Import { MainComponent } from './main/main.component';
// Import { OnboardingComponent } from './onboarding/onboarding.component';
import { SiRoutingModule } from './si-routing.module';


@NgModule({
  declarations: [
    SiComponent
    // ConfigurationComponent,
    // DashboardComponent,
    // MainComponent,
    // OnboardingComponent,
    // OnboardingDoneComponent,
    // OnboardingExportSettingComponent,
    // OnboardingAdvancedSettingComponent
  ],
  imports: [
    CommonModule,
    SiRoutingModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class SiModule { }
