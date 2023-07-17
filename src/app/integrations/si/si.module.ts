import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiComponent } from './si.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { OnboardingAdvancedSettingComponent } from './onboarding/onboarding-advanced-setting/onboarding-advanced-setting.component';
import { OnboardingDoneComponent } from './onboarding/onboarding-done/onboarding-done.component';
import { OnboardingLandingComponent } from './onboarding/onboarding-landing/onboarding-landing.component';
import { OnboardingExportSettingComponent } from './onboarding/onboarding-export-setting/onboarding-export-setting.component';
import { ConfigurationComponent } from './main/configuration/configuration.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SiRoutingModule } from './si-routing.module';


@NgModule({
  declarations: [
    SiComponent,
    OnboardingLandingComponent,
    ConfigurationComponent,
    DashboardComponent,
    MainComponent,
    OnboardingComponent,
    OnboardingDoneComponent,
    OnboardingExportSettingComponent,
    OnboardingAdvancedSettingComponent
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
