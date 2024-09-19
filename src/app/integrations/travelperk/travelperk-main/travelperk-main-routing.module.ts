import { NgModule } from '@angular/core';
import type { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TravelperkMainComponent } from './travelperk-main.component';

const routes: Routes = [
  {
    path: '',
    component: TravelperkMainComponent,
    children: [
      {
        path: 'configuration',
        loadChildren: () => import('./travelperk-configuration/travelperk-configuration.module').then(m => m.TravelperkConfigurationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelperkMainRoutingModule { }
