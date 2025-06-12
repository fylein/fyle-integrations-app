import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppLandingPageHeaderComponent } from './components/helper/app-landing-page-header/app-landing-page-header.component';
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
import { ZeroStateWithIllustrationComponent } from './components/helper/zero-state-with-illustration/zero-state-with-illustration.component';
import { QbdOnboardingStepperComponent } from './components/qbd/helper/qbd-onboarding-stepper/qbd-onboarding-stepper.component';
import { OnboardingSteppersComponent } from './components/helper/onboarding-stepper/onboarding-stepper.component';
import { ConfigurationToggleFieldComponent } from './components/configuration/configuration-toggle-field/configuration-toggle-field.component';
import { ConfigurationSelectFieldComponent } from './components/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationRadioFieldComponent } from './components/configuration/configuration-radio-field/configuration-radio-field.component';
import { ConfigurationStepFooterComponent } from './components/configuration/configuration-step-footer/configuration-step-footer.component';
import { ConfigurationStepHeaderComponent } from './components/configuration/configuration-step-header/configuration-step-header.component';
import { EmailMultiSelectFieldComponent } from './components/configuration/email-multi-select-field/email-multi-select-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationMultiSelectComponent } from './components/configuration/configuration-multi-select/configuration-multi-select.component';
import { ConfigurationLabelComponent } from './components/configuration/configuration-label/configuration-label.component';
import { CalendarModule } from 'primeng/calendar';
import { AppLandingPageBodyComponent } from './components/helper/app-landing-page-body/app-landing-page-body.component';
import { QbdMappingTableComponent } from './components/qbd/mapping/qbd-mapping-table/qbd-mapping-table.component';
import { MappingFilterComponent } from './components/helper/mapping/mapping-filter/mapping-filter.component';
import { QbdMappingHeaderSectionComponent } from './components/qbd/mapping/qbd-mapping-header-section/qbd-mapping-header-section.component';
import { TableModule } from 'primeng/table';
import { IntacctConnectorComponent } from './components/si/core/intacct-connector/intacct-connector.component';
import { IntacctLocationEntityComponent } from './components/si/core/intacct-location-entity/intacct-location-entity.component';
import { SkipExportComponent } from './components/si/helper/skip-export/skip-export.component';
import { ChipsModule } from 'primeng/chips';
import { TabMenuModule } from 'primeng/tabmenu';
import { DashboardMappingResolveComponent } from './components/si/helper/dashboard-mapping-resolve/dashboard-mapping-resolve.component';
import { DashboardIntacctErrorsComponent } from './components/si/helper/dashboard-intacct-errors/dashboard-intacct-errors.component';
import { DashboardExportSectionComponent } from './components/dashboard/dashboard-export-section/dashboard-export-section.component';
import { DashboardErrorSectionComponent } from './components/dashboard/dashboard-error-section/dashboard-error-section.component';
import { DashboardExportLogDialogComponent } from './components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardTokenExpiredComponent } from './components/dashboard/dashboard-token-expired/dashboard-token-expired.component';
import { DashboardAccountingErrorDialogComponent } from './components/dashboard/dashboard-accounting-error-dialog/dashboard-accounting-error-dialog.component';
import { DashboardExportSummarySectionComponent } from './components/dashboard/dashboard-export-summary-section/dashboard-export-summary-section.component';
import { ConfigurationTextFieldComponent } from './components/configuration/configuration-text-field/configuration-text-field.component';
import { OnboardingDoneComponent } from './components/helper/onboarding-done/onboarding-done.component';
import { PreviewDialogComponent } from './components/configuration/preview-dialog/preview-dialog.component';
import { MainMenuComponent } from './components/menu/main-menu/main-menu.component';
import { ConfigurationImportFieldComponent } from './components/configuration/configuration-import-field/configuration-import-field.component';
import { ConfigurationInfoLabelComponent } from './components/configuration/configuration-info-label/configuration-info-label.component';
import { ConfigurationCustomFieldCreationDialogComponent } from './components/configuration/configuration-custom-field-creation-dialog/configuration-custom-field-creation-dialog.component';
import { ConfigurationConfirmationDialogComponent } from './components/configuration/configuration-confirmation-dialog/configuration-confirmation-dialog.component';
import { ZeroStateComponent } from './components/helper/zero-state/zero-state.component';
import { ConfigurationSkipExportComponent } from './components/configuration/configuration-skip-export/configuration-skip-export.component';
import { ConfigurationStepSubHeaderComponent } from './components/configuration/configuration-step-sub-header/configuration-step-sub-header.component';
import { GenericMappingV2Component } from './components/helper/mapping/generic-mapping-v2/generic-mapping-v2.component';
import { GenericMappingTableComponent } from './components/helper/mapping/generic-mapping-table/generic-mapping-table.component';
import { SubMenuComponent } from './components/menu/sub-menu/sub-menu.component';
import { MappingCardHeaderComponent } from './components/helper/mapping/mapping-card-header/mapping-card-header.component';
import { ConfigurationScheduleExportComponent } from './components/configuration/configuration-schedule-export/configuration-schedule-export.component';
import { ConfigurationConnectorComponent } from './components/configuration/configuration-connector/configuration-connector.component';
import { ExportLogTableComponent } from './components/export-log/export-log-table/export-log-table.component';
import { ExportLogFilterComponent } from './components/export-log/export-log-filter/export-log-filter.component';
import { ExportLogChildTableDialogComponent } from './components/export-log/export-log-dialog/export-log-child-table-dialog.component';
import { SkippedExportLogTableComponent } from './components/export-log/skipped-export-log-table/skipped-export-log-table.component';
import { ShimmersComponent } from './components/helper/shimmers/shimmers.component';
import { CloneSettingHeaderComponent } from './components/onboarding/clone-setting/clone-setting-header/clone-setting-header.component';
import { DropdownComponent } from './components/input/dropdown/dropdown.component';
import { CloneSettingFieldComponent } from './components/onboarding/clone-setting/clone-setting-field/clone-setting-field.component';
import { ToggleComponent } from './components/input/toggle/toggle.component';
import { MultiSelectComponent } from './components/input/multi-select/multi-select.component';
import { ConfigurationMappingFieldsComponent } from './components/configuration/configuration-mapping-fields/configuration-mapping-fields.component';
import { SvgIconComponent } from './components/core/svg-icon/svg-icon.component';
import { NetsuiteConnectorComponent } from './components/netsuite/core/netsuite-connector/netsuite-connector.component';
import { NetsuiteSubsidiaryMappingComponent } from './components/netsuite/core/netsuite-subsidiary-mapping/netsuite-subsidiary-mapping.component';
import { SearchComponent } from './components/input/search/search.component';
import { OptionalFieldComponent } from './components/helper/optional-field/optional-field.component';
import { SentenceCasePipe } from './pipes/sentence-case.pipe';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BadgeComponent } from './components/core/badge/badge.component';
import { CheckboxButtonComponent } from './components/input/checkbox-button/checkbox-button.component';
import { QbdDirectAssistedSetupComponent } from '../integrations/qbd-direct/qbd-direct-shared/qbd-direct-assisted-setup/qbd-direct-assisted-setup.component';
import { OutlinedIconButtonComponent } from './components/input/outlined-icon-button/outlined-icon-button.component';
import { SkippedExportLogComponent } from './pages/export-log/skipped-export-log/skipped-export-log.component';


@NgModule({
  declarations: [
    LoaderComponent,
    AppLandingPageHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
    SearchPipe,
    PaginatorComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    ZeroStateWithIllustrationComponent,
    QbdOnboardingStepperComponent,
    OnboardingSteppersComponent,
    ConfigurationToggleFieldComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationRadioFieldComponent,
    ConfigurationStepFooterComponent,
    ConfigurationStepHeaderComponent,
    EmailMultiSelectFieldComponent,
    ConfigurationMultiSelectComponent,
    ConfigurationLabelComponent,
    AppLandingPageBodyComponent,
    IntacctConnectorComponent,
    IntacctLocationEntityComponent,
    QbdMappingTableComponent,
    MappingFilterComponent,
    QbdMappingHeaderSectionComponent,
    SkipExportComponent,
    DashboardMappingResolveComponent,
    DashboardIntacctErrorsComponent,
    DashboardExportSectionComponent,
    DashboardErrorSectionComponent,
    DashboardExportLogDialogComponent,
    DashboardTokenExpiredComponent,
    DashboardAccountingErrorDialogComponent,
    DashboardExportSummarySectionComponent,
    ConfigurationTextFieldComponent,
    OnboardingDoneComponent,
    PreviewDialogComponent,
    MainMenuComponent,
    ConfigurationImportFieldComponent,
    ConfigurationInfoLabelComponent,
    ConfigurationCustomFieldCreationDialogComponent,
    ConfigurationConfirmationDialogComponent,
    ZeroStateComponent,
    ConfigurationSkipExportComponent,
    ConfigurationStepSubHeaderComponent,
    GenericMappingV2Component,
    GenericMappingTableComponent,
    SubMenuComponent,
    MappingCardHeaderComponent,
    ConfigurationScheduleExportComponent,
    ConfigurationConnectorComponent,
    ExportLogTableComponent,
    ExportLogFilterComponent,
    ExportLogChildTableDialogComponent,
    SkippedExportLogTableComponent,
    ShimmersComponent,
    CloneSettingHeaderComponent,
    DropdownComponent,
    CloneSettingFieldComponent,
    ToggleComponent,
    MultiSelectComponent,
    SvgIconComponent,
    NetsuiteConnectorComponent,
    NetsuiteSubsidiaryMappingComponent,
    ConfigurationMappingFieldsComponent,
    SvgIconComponent,
    NetsuiteConnectorComponent,
    NetsuiteSubsidiaryMappingComponent,
    SearchComponent,
    OptionalFieldComponent,
    SentenceCasePipe,
    BadgeComponent,
    OutlinedIconButtonComponent,
    QbdDirectAssistedSetupComponent,
    SkippedExportLogComponent
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
    IconFieldModule,
    InputIconModule,
    CheckboxButtonComponent,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    LoaderComponent,
    AppLandingPageBodyComponent,
    AppLandingPageHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
    SearchPipe,
    PaginatorComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    ZeroStateWithIllustrationComponent,
    QbdOnboardingStepperComponent,
    OnboardingSteppersComponent,
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
    IntacctConnectorComponent,
    NetsuiteConnectorComponent,
    NetsuiteSubsidiaryMappingComponent,
    IntacctLocationEntityComponent,
    QbdMappingTableComponent,
    MappingFilterComponent,
    QbdMappingHeaderSectionComponent,
    DashboardMappingResolveComponent,
    DashboardIntacctErrorsComponent,
    DashboardExportSectionComponent,
    DashboardErrorSectionComponent,
    DashboardExportLogDialogComponent,
    DashboardTokenExpiredComponent,
    DashboardAccountingErrorDialogComponent,
    ConfigurationTextFieldComponent,
    OnboardingDoneComponent,
    MainMenuComponent,
    ConfigurationImportFieldComponent,
    ConfigurationLabelComponent,
    ConfigurationInfoLabelComponent,
    ConfigurationCustomFieldCreationDialogComponent,
    ConfigurationConfirmationDialogComponent,
    ZeroStateComponent,
    DashboardExportSummarySectionComponent,
    PreviewDialogComponent,
    ConfigurationSkipExportComponent,
    ConfigurationStepSubHeaderComponent,
    GenericMappingV2Component,
    SubMenuComponent,
    ConfigurationScheduleExportComponent,
    ConfigurationConnectorComponent,
    ExportLogTableComponent,
    ExportLogFilterComponent,
    ExportLogChildTableDialogComponent,
    SkippedExportLogTableComponent,
    ShimmersComponent,
    CloneSettingHeaderComponent,
    DropdownComponent,
    CloneSettingFieldComponent,
    ToggleComponent,
    MultiSelectComponent,
    ConfigurationMappingFieldsComponent,
    SvgIconComponent,
    SearchComponent,
    SkipExportComponent,
    OptionalFieldComponent,
    SentenceCasePipe,
    BadgeComponent,
    CheckboxButtonComponent,
    OutlinedIconButtonComponent,
    QbdDirectAssistedSetupComponent,
    SkippedExportLogComponent
  ]
})
export class SharedModule { }
