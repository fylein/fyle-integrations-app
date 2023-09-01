import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiComponent } from './si.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SiRoutingModule } from './si-routing.module';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';


@NgModule({
  declarations: [
    SiComponent,
    MainComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SiRoutingModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    TableModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class SiModule { }
