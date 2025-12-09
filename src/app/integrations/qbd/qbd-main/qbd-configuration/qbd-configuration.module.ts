import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurationRoutingModule } from './qbd-configuration-routing.module';
import { QbdConfigurationAdvancedSettingComponent } from './qbd-configuration-advanced-setting/qbd-configuration-advanced-setting.component';
import { QbdConfigurationFieldSettingComponent } from './qbd-configuration-field-setting/qbd-configuration-field-setting.component';
import { QbdConfigurationExportSettingComponent } from './qbd-configuration-export-setting/qbd-configuration-export-setting.component';
import { QbdSharedModule } from '../../qbd-shared/qbd-shared.module';

@NgModule({
  declarations: [
    QbdConfigurationAdvancedSettingComponent,
    QbdConfigurationFieldSettingComponent,
    QbdConfigurationExportSettingComponent,
  ],
  imports: [CommonModule, ConfigurationRoutingModule, SharedModule, QbdSharedModule],
})
export class QbdConfigurationModule {}
