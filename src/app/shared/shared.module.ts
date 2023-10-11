import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/helper/app-landing-page-header/app-landing-page-header.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { DragDropModule } from 'primeng/dragdrop';
import { ProgressBarModule } from 'primeng/progressbar';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ErrorComponent } from './components/core/error/error.component';
import { TrimCharacterPipe } from './pipes/trim-character.pipe';
import { SnakeCaseToSpaceCasePipe } from './pipes/snake-case-to-space-case.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { PaginatorComponent } from './components/helper/paginator/paginator.component';
import { MandatoryFieldComponent } from './components/helper/mandatory-field/mandatory-field.component';
import { MandatoryErrorMessageComponent } from './components/helper/mandatory-error-message/mandatory-error-message.component';
import { ZeroStateWithIllustrationComponent } from './components/qbd/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { DateFilterComponent } from './components/qbd/helper/date-filter/date-filter.component';
import { OnboardingStepperComponent } from './components/qbd/helper/onboarding-stepper/onboarding-stepper.component';
import { ExportSettingComponent } from './components/qbd/configuration/export-setting/export-setting.component';
import { AdvancedSettingComponent } from './components/qbd/configuration/advanced-setting/advanced-setting.component';
import { FieldMappingComponent } from './components/qbd/configuration/field-mapping/field-mapping.component';
import { ConfigurationToggleFieldComponent } from './components/qbd/configuration/configuration-toggle-field/configuration-toggle-field.component';
import { ConfigurationSelectFieldComponent } from './components/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationRadioFieldComponent } from './components/qbd/configuration/configuration-radio-field/configuration-radio-field.component';
import { ConfigurationStepFooterComponent } from './components/configuration/configuration-step-footer/configuration-step-footer.component';
import { ConfigurationStepHeaderComponent } from './components/configuration/configuration-step-header/configuration-step-header.component';
import { EmailMultiSelectFieldComponent } from './components/configuration/email-multi-select-field/email-multi-select-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationMultiSelectComponent } from './components/qbd/configuration/configuration-multi-select/configuration-multi-select.component';
import { ConfigurationLabelComponent } from './components/qbd/configuration/configuration-label/configuration-label.component';
import { CalendarModule } from 'primeng/calendar';
import { AppIntegrationLandingComponent } from './components/helper/app-landing-page-body/app-landing-page-body.component';
import { MappingTableComponent } from './components/qbd/mapping/mapping-table/mapping-table.component';
import { MappingFilterComponent } from './components/qbd/mapping/mapping-filter/mapping-filter.component';
import { MappingHeaderSectionComponent } from './components/qbd/mapping/mapping-header-section/mapping-header-section.component';
import { TableModule } from 'primeng/table';
import { ConfigurationExportSettingsComponent } from './components/si/configuration/configuration-export-settings/configuration-export-settings.component';
import { IntacctStepperComponent } from './components/si/helper/intacct-stepper/intacct-stepper.component';
import { IntacctConnectorComponent } from './components/si/core/intacct-connector/intacct-connector.component';
import { IntacctLocationEntityComponent } from './components/si/core/intacct-location-entity/intacct-location-entity.component';
import { ConfigurationImportSettingsComponent } from './components/si/configuration/configuration-import-settings/configuration-import-settings.component';
import { ConfigurationAdvancedSettingsComponent } from './components/si/configuration/configuration-advanced-settings/configuration-advanced-settings.component';
import { SkipExportComponent } from './components/si/helper/skip-export/skip-export.component';
import { ChipsModule } from 'primeng/chips';
import { TabMenuModule } from 'primeng/tabmenu';
import { DashboardMappingResolveComponent } from './components/si/helper/dashboard-mapping-resolve/dashboard-mapping-resolve.component';
import { DashboardIntacctErrorsComponent } from './components/si/helper/dashboard-intacct-errors/dashboard-intacct-errors.component';
import { DashboardMenuComponent } from './components/core/dashboard-menu/dashboard-menu.component';

@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
    SearchPipe,
    PaginatorComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    ZeroStateWithIllustrationComponent,
    DateFilterComponent,
    OnboardingStepperComponent,
    ExportSettingComponent,
    AdvancedSettingComponent,
    FieldMappingComponent,
    ConfigurationToggleFieldComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationRadioFieldComponent,
    ConfigurationStepFooterComponent,
    ConfigurationStepHeaderComponent,
    EmailMultiSelectFieldComponent,
    ConfigurationMultiSelectComponent,
    ConfigurationLabelComponent,
    AppIntegrationLandingComponent,
    IntacctStepperComponent,
    IntacctConnectorComponent,
    IntacctLocationEntityComponent,
    MappingTableComponent,
    MappingFilterComponent,
    MappingHeaderSectionComponent,
    ConfigurationExportSettingsComponent,
    ConfigurationImportSettingsComponent,
    ConfigurationAdvancedSettingsComponent,
    SkipExportComponent,
    DashboardMappingResolveComponent,
    DashboardIntacctErrorsComponent,
    DashboardMenuComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    InputSwitchModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    MultiSelectModule,
    DragDropModule,
    ProgressBarModule,
    CalendarModule,
    ChipsModule,
    TableModule,
    TabMenuModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    LoaderComponent,
    AppIntegrationLandingComponent,
    AppHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
    SearchPipe,
    PaginatorComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    ZeroStateWithIllustrationComponent,
    DateFilterComponent,
    OnboardingStepperComponent,
    ExportSettingComponent,
    AdvancedSettingComponent,
    FieldMappingComponent,
    ConfigurationToggleFieldComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationRadioFieldComponent,
    ConfigurationStepFooterComponent,
    ConfigurationStepHeaderComponent,
    EmailMultiSelectFieldComponent,
    ConfigurationMultiSelectComponent,
    DropdownModule,
    CalendarModule,
    ChipsModule,
    FormsModule, ReactiveFormsModule, ProgressBarModule,
    ToastModule,
    IntacctStepperComponent,
    ConfigurationStepFooterComponent,
    ConfigurationStepHeaderComponent,
    IntacctConnectorComponent,
    IntacctLocationEntityComponent,
    MappingTableComponent,
    MappingFilterComponent,
    MappingHeaderSectionComponent,
    ConfigurationExportSettingsComponent,
    ConfigurationImportSettingsComponent,
    ConfigurationAdvancedSettingsComponent,
    DashboardMappingResolveComponent,
    DashboardIntacctErrorsComponent,
    DashboardMenuComponent
  ]
})
export class SharedModule { }
