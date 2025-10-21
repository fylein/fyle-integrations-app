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
          },
          {
            path: 'advanced_settings',
            loadComponent: () => import('./sage50-shared/sage50-advanced-settings/sage50-advanced-settings.component').then(m => m.Sage50AdvancedSettingsComponent)
          },
          {
            path: 'done',
            loadComponent: () => import('./sage50-onboarding/sage50-onboarding-done/sage50-onboarding-done.component').then(m => m.Sage50OnboardingDoneComponent)
          }
        ]
      },
      {
        path: 'main',
        loadComponent: () => import('./sage50-main/sage50-main.component').then(m => m.Sage50MainComponent),
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./sage50-main/sage50-dashboard/sage50-dashboard.component').then(m => m.Sage50DashboardComponent)
          },
          {
            path: 'mapping',
            loadComponent: () => import('./sage50-main/sage50-mapping/sage50-mapping.component').then(m => m.Sage50MappingComponent),
            children: [
              {
                path: '',
                redirectTo: 'employee',
                pathMatch: 'full'
              },
              {
                path: ':source_field',
                loadComponent: () => import('./sage50-main/sage50-mapping/sage50-base-mapping/sage50-base-mapping.component').then(m => m.Sage50BaseMappingComponent)
              }
            ]
          },
          {
            path: 'configuration',
            loadComponent: () => import('./sage50-main/sage50-configuration/sage50-configuration.component').then(m => m.Sage50ConfigurationComponent),
            children: [
              {
                path: '',
                redirectTo: 'export_settings',
                pathMatch: 'full'
              },
              {
                path: 'export_settings',
                loadComponent: () => import('./sage50-shared/sage50-export-settings/sage50-export-settings.component').then(m => m.Sage50ExportSettingsComponent)
              },
              {
                path: 'import_settings',
                loadComponent: () => import('./sage50-shared/sage50-import-settings/sage50-import-settings.component').then(m => m.Sage50ImportSettingsComponent)
              },
              {
                path: 'advanced_settings',
                loadComponent: () => import('./sage50-shared/sage50-advanced-settings/sage50-advanced-settings.component').then(m => m.Sage50AdvancedSettingsComponent)
              }
            ]
          }
        ]
      }
    ]
  }
];