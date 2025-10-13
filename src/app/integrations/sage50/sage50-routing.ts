import { Routes } from '@angular/router';

export const SAGE50_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sage50.component').then(m => m.Sage50Component),
    children: [
      {
        path: 'onboarding',
        loadComponent: () => import('./sage50-onboarding/sage50-onboarding.component').then(m => m.Sage50OnboardingComponent),
        children: [
          {
            path: '',
            redirectTo: '/integrations/sage50',
            pathMatch: 'full'
          },
          {
            path: 'landing',
            loadComponent: () => import('./sage50-onboarding/sage50-onboarding-landing/sage50-onboarding-landing.component').then(m => m.Sage50OnboardingLandingComponent)
          },
          {
            path: 'prerequisites',
            loadComponent: () => import('./sage50-onboarding/sage50-onboarding-prerequisites/sage50-onboarding-prerequisites.component').then(m => m.Sage50OnboardingPrerequisitesComponent)
          },
          {
            path: 'export_settings',
            loadComponent: () => import('./sage50-shared/sage50-export-settings/sage50-export-settings.component').then(m => m.Sage50ExportSettingsComponent)
          },
          {
            path: 'import_settings',
            loadComponent: () => import('./sage50-shared/sage50-import-settings/sage50-import-settings.component').then(m => m.Sage50ImportSettingsComponent)
          }
        ]
      }
    ]
  }
];