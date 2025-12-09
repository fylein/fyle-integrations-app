import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './intacct-main-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [],
  imports: [CommonModule, TabsModule, ButtonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
