import { Routes } from '@angular/router';

export const SAGE50_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sage50.component').then(m => m.Sage50Component),
    children: [
      {
        path: 'onboarding',
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
          }
        ]
      }
    ]
  }
];