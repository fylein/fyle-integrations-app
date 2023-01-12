import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/core/loader/loader.component';
import { AppHeaderComponent } from './components/apps/app-header/app-header.component';

// External Libraries
import { IconSpriteModule } from 'ng-svg-icon-sprite';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ErrorComponent } from './components/core/error/error.component';
import { TrimCharacterPipe } from './pipes/trim-character.pipe';
import { DateFilterPipe } from './pipes/date-filter.pipe';
import { SnakeCaseToSpaceCasePipe } from './pipes/snake-case-to-space-case.pipe';
import { PaginatorComponent } from './helper/paginator/paginator.component';
import { MandatoryFieldComponent } from './helper/mandatory-field/mandatory-field.component';
import { MandatoryErrorMessageComponent } from './helper/mandatory-error-message/mandatory-error-message.component';
import { ZeroStateWithIllustrationComponent } from './qbd/components/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { PostOnboardingHeaderComponent } from './qbd/components/core/post-onboarding-header/post-onboarding-header.component';
import { DateFilterComponent } from './qbd/components/helper/date-filter/date-filter.component';
import { OnboardingStepperComponent } from './qbd/components/helper/onboarding-stepper/onboarding-stepper.component';
import { ExportSettingComponent } from './qbd/components/configuration/export-setting/export-setting.component';
import { AdvancedSettingComponent } from './qbd/components/configuration/advanced-setting/advanced-setting.component';
import { FieldMappingComponent } from './qbd/components/configuration/field-mapping/field-mapping.component';
import { ConfigurationToggleFieldComponent } from './qbd/components/configuration/configuration-toggle-field/configuration-toggle-field.component';
import { ConfigurationSelectFieldComponent } from './qbd/components/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationRadioFieldComponent } from './qbd/components/configuration/configuration-radio-field/configuration-radio-field.component';
import { ConfigurationStepFooterComponent } from './qbd/components/configuration/configuration-step-footer/configuration-step-footer.component';
import { ConfigurationStepHeaderComponent } from './qbd/components/configuration/configuration-step-header/configuration-step-header.component';
import { EmailMultiSelectFieldComponent } from './qbd/components/configuration/email-multi-select-field/email-multi-select-field.component';
import { AddEmailDialogComponent } from './qbd/components/configuration/advanced-setting/add-email-dialog/add-email-dialog.component';


@NgModule({
  declarations: [
    LoaderComponent,
    AppHeaderComponent,
    ErrorComponent,
    TrimCharacterPipe,
    DateFilterPipe,
    SnakeCaseToSpaceCasePipe,
    PaginatorComponent,
    MandatoryFieldComponent,
    MandatoryErrorMessageComponent,
    ZeroStateWithIllustrationComponent,
    PostOnboardingHeaderComponent,
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
    AddEmailDialogComponent
  ],
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    SkeletonModule,
    IconSpriteModule.forRoot({ path: 'assets/sprites/sprite.svg' })
  ],
  exports: [
    LoaderComponent,
    AppHeaderComponent,
    ErrorComponent
  ]
})
export class SharedModule { }
