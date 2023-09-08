import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationExportSettingComponent } from './configuration-export-setting/configuration-export-setting.component';
import { ConfigurationAdvancedSettingComponent } from './configuration-advanced-setting/configuration-advanced-setting.component';
import { ConfigurationImportSettingComponent } from './configuration-import-setting/configuration-import-setting.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule
  ]
})
export class ConfigurationModule { }
