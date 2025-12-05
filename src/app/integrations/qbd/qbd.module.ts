import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QbdRoutingModule } from './qbd-routing.module';
import { QbdMainComponent } from './qbd-main/qbd-main.component';
import { QbdOnboardingComponent } from './qbd-onboarding/qbd-onboarding.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { QbdSharedModule } from './qbd-shared/qbd-shared.module';


@NgModule({
  declarations: [
    QbdMainComponent,
    QbdOnboardingComponent
  ],
  imports: [
    CommonModule,
    QbdRoutingModule,
    SharedModule,
    SelectModule,
    TableModule,
    QbdSharedModule
  ]
})
export class QbdModule { }
