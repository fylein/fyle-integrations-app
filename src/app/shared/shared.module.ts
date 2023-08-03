import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';
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
import { PaginatorComponent } from './helper/paginator/paginator.component';
import { MandatoryFieldComponent } from './helper/mandatory-field/mandatory-field.component';
import { MandatoryErrorMessageComponent } from './helper/mandatory-error-message/mandatory-error-message.component';
import { ZeroStateWithIllustrationComponent } from './components/qbd/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { DateFilterComponent } from './components/qbd/helper/date-filter/date-filter.component';
import { OnboardingStepperComponent } from './components/qbd/helper/onboarding-stepper/onboarding-stepper.component';
import { ExportSettingComponent } from './components/qbd/configuration/export-setting/export-setting.component';
import { AdvancedSettingComponent } from './components/qbd/configuration/advanced-setting/advanced-setting.component';
import { FieldMappingComponent } from './components/qbd/configuration/field-mapping/field-mapping.component';
import { ConfigurationToggleFieldComponent } from './components/qbd/configuration/configuration-toggle-field/configuration-toggle-field.component';
import { ConfigurationSelectFieldComponent } from './components/qbd/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationRadioFieldComponent } from './components/qbd/configuration/configuration-radio-field/configuration-radio-field.component';
import { ConfigurationStepFooterComponent } from './components/apps/configuration-step-footer/configuration-step-footer.component';
import { ConfigurationStepHeaderComponent } from './components/apps/configuration-step-header/configuration-step-header.component';
import { EmailMultiSelectFieldComponent } from './components/apps/email-multi-select-field/email-multi-select-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationMultiSelectComponent } from './components/qbd/configuration/configuration-multi-select/configuration-multi-select.component';
import { ConfigurationLabelComponent } from './components/qbd/configuration/configuration-label/configuration-label.component';
import { CalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from "primeng/cascadeselect";
import { AppIntegrationLandingComponent } from './components/apps/app-integration-landing/app-integration-landing.component';
import { IntacctStepperComponent } from './components/apps/intacct-stepper/intacct-stepper.component';
import { IntacctLocationEntityComponent } from './components/apps/intacct-location-entity/intacct-location-entity.component';
import { IntacctConnectorComponent } from './components/apps/intacct-connector/intacct-connector.component';

@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
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
    IntacctLocationEntityComponent
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
    CascadeSelectModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    LoaderComponent,
    AppIntegrationLandingComponent,
    AppHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    SnakeCaseToSpaceCasePipe,
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
    FormsModule, ReactiveFormsModule, ProgressBarModule,
    ToastModule,
    CascadeSelectModule,
    IntacctStepperComponent,
    ConfigurationStepFooterComponent,
    ConfigurationStepHeaderComponent,
    IntacctConnectorComponent,
    IntacctLocationEntityComponent
  ]
})
export class SharedModule { }
