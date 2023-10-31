import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300OnboardingComponent } from './sage300-onboarding/sage300-onboarding.component';
import { Sage300RoutingModule } from './sage300-routing.module';
import { Sage300MainComponent } from './sage300-main/sage300-main.component';
import { Sage300ExportSettingsComponent } from './sage300-shared/sage300-export-settings/sage300-export-settings.component';
import { Sage300SharedModule } from './sage300-shared/sage300-shared.module';


@NgModule({
  declarations: [
    Sage300OnboardingComponent,
    Sage300MainComponent
  ],
  imports: [
    CommonModule,
    Sage300SharedModule,
    Sage300RoutingModule
  ]
})
export class Sage300Module { }
