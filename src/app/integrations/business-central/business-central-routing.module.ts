import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessCentralComponent } from './business-central.component';
import { BusinessCentralTokenGuard } from 'src/app/core/guard/business-central-token.guard';

const routes: Routes = [
  {
    path: '',
    component: BusinessCentralComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: () =>
          import('./business-central-onboarding/business-central-onboarding.module').then(
            (m) => m.BusinessCentralOnboardingModule,
          ),
      },
      {
        path: 'main',
        loadChildren: () =>
          import('./business-central-main/business-central-main.module').then((m) => m.BusinessCentralMainModule),
        canActivate: [BusinessCentralTokenGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessCentralRoutingModule {}
