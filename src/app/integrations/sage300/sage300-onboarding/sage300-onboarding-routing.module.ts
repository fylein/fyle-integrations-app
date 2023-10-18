import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sage300OnboardingComponent } from './sage300-onboarding.component';
import { Sage300OnboardingLandingComponent } from './sage300-onboarding-landing/sage300-onboarding-landing.component';
import { Sage300OnboardingExportSettingsComponent } from './sage300-onboarding-export-settings/sage300-onboarding-export-settings.component';


const routes: Routes = [
  {
    path: '',
    component: Sage300OnboardingComponent,
    children: [
      {
        path: 'landing',
        component: Sage300OnboardingLandingComponent
      },
      {
        path: 'export_settings',
        component: Sage300OnboardingExportSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Sage300OnboardingRoutingModule { }
