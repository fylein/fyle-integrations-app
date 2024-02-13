import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntacctComponent } from './intacct.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { SiRoutingModule } from './intacct-routing.module';
import { MainComponent } from './intacct-main/main.component';
import { ConfigurationComponent } from './intacct-main/intacct-configuration/configuration.component';
import { ConfigurationExportSettingComponent } from './intacct-main/intacct-configuration/configuration-export-setting/configuration-export-setting.component';
import { ConfigurationAdvancedSettingComponent } from './intacct-main/intacct-configuration/configuration-advanced-setting/configuration-advanced-setting.component';
import { ConfigurationImportSettingComponent } from './intacct-main/intacct-configuration/configuration-import-setting/configuration-import-setting.component';
import { DialogModule } from 'primeng/dialog';
import { IntacctSharedModule } from './intacct-shared/intacct-shared.module';


@NgModule({
    declarations: [
        IntacctComponent,
        MainComponent,
        ConfigurationComponent,
        ConfigurationExportSettingComponent,
        ConfigurationAdvancedSettingComponent,
        ConfigurationImportSettingComponent
    ],
    imports: [
        DialogModule,
        TableModule,
        CommonModule,
        SiRoutingModule,
        SharedModule,
        TabMenuModule,
        DropdownModule,
        IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' }),
        IntacctSharedModule
    ]
})
export class IntacctModule { }
