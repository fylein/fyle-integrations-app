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
import { ConfigurationComponent } from './main/configuration/configuration.component';
import { ConfigurationExportSettingComponent } from './main/configuration/configuration-export-setting/configuration-export-setting.component';
import { ConfigurationAdvancedSettingComponent } from './main/configuration/configuration-advanced-setting/configuration-advanced-setting.component';
import { ConfigurationImportSettingComponent } from './main/configuration/configuration-import-setting/configuration-import-setting.component';
import { DialogModule } from 'primeng/dialog';
import { IntacctExportSettingsComponent } from './intacct-shared/intacct-export-settings/intacct-export-settings.component';


@NgModule({
  declarations: [
    SiComponent,
    MainComponent,
    ConfigurationComponent,
    ConfigurationExportSettingComponent,
    ConfigurationAdvancedSettingComponent,
    ConfigurationImportSettingComponent,
    IntacctExportSettingsComponent
  ],
  imports: [
    DialogModule,
    TableModule,
    CommonModule,
    SiRoutingModule,
    SharedModule,
    TabMenuModule,
    DropdownModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ]
})
export class SiModule { }
