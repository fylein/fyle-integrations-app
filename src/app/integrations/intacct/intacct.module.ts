import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctComponent } from './intacct.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { SiRoutingModule } from './intacct-routing.module';
import { MainComponent } from './intacct-main/intacct-main.component';
import { DialogModule } from 'primeng/dialog';
import { IntacctSharedModule } from './intacct-shared/intacct-shared.module';


@NgModule({
    declarations: [
        IntacctComponent,
        MainComponent
    ],
    imports: [
        DialogModule,
        TableModule,
        CommonModule,
        SiRoutingModule,
        SharedModule,

        SelectModule,
        IntacctSharedModule
    ]
})
export class IntacctModule { }
