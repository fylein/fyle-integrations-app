import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './intacct-dashboard-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { IntacctDashboardComponent } from './intacct-dashboard.component';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    IntacctDashboardComponent
  ],
  imports: [

    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    SkeletonModule,
    DialogModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class IntacctDashboardModule { }
