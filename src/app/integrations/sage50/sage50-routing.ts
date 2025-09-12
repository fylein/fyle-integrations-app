import { Routes } from '@angular/router';

export const SAGE50_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sage50.component').then(m => m.Sage50Component)
  }
];