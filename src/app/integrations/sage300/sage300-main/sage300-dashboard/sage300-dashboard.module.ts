import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sage300DashboardRoutingModule } from './sage300-dashboard-routing.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { Sage300DashboardComponent } from './sage300-dashboard.component';



@NgModule({
  declarations: [
    Sage300DashboardComponent
  ],
  imports: [
    CommonModule,
    Sage300DashboardRoutingModule,
    TabMenuModule,
    SkeletonModule,
    DialogModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class Sage300DashboardModule { }
