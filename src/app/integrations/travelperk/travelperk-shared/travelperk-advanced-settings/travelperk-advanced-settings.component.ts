import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { brandingConfig, brandingKbArticles, brandingStyle } from 'src/app/branding/branding-config';
import { ToastSeverity, TrackingApp, Page, TravelPerkOnboardingState, TravelperkUpdateEvent, AppName, ConfigurationCta } from 'src/app/core/models/enum/enum.model';
import { TravelperkAdvancedSettingGet } from 'src/app/core/models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { HelperService } from 'src/app/core/services/common/helper.service';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { WorkspaceService } from 'src/app/core/services/common/workspace.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { travelperkAdvancedSettingsResponse, travelperkDestinationAttribute } from '../travelperk.fixture';
import { catchError, forkJoin, of } from 'rxjs';
import { TravelperkDestinationAttribuite } from 'src/app/core/models/travelperk/travelperk.model';
import { SelectFormLabel, SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { TranslocoService } from '@jsverse/transloco';
import { TravelperkAdvancedSettingService } from 'src/app/core/services/travelperk/travelperk-advanced-settings.service';

@Component({
  selector: 'app-travelperk-advanced-settings',
  templateUrl: './travelperk-advanced-settings.component.html',
  styleUrls: ['./travelperk-advanced-settings.component.scss']
})
export class TravelperkAdvancedSettingsComponent implements OnInit {

  appName: string = AppName.TRAVELPERK;

  isOnboarding: boolean;

  isLoading: boolean = true;

  advancedSettings: TravelperkAdvancedSettingGet | null;

  advancedSettingsForm: any;

  isSaveInProgress: boolean;

  sessionStartTime: Date = new Date();

  supportArticleLink: string = brandingKbArticles.onboardingArticles.TRAVELPERK.ADVANCED_SETTING;

  ConfigurationCtaText = ConfigurationCta;

  readonly brandingConfig = brandingConfig;

  defaultCategories: TravelperkDestinationAttribuite[];

  destinationFieldOptions: SelectFormOption[] = TravelperkAdvancedSettingService.getDefaultCategory();

  defaultMemoOptions: string[] = ['trip_id', 'trip_name', 'traveler_name', 'booker_name', 'merchant_name'];

  memoPreviewText: string;

  memoStructure: string[] = [];

  destinationAttributeNames: SelectFormLabel = {
    label: 'label',
    value: ''
  };

  sourceAttributeNames: SelectFormLabel = {
    label: 'value',
    value: ''
  };

  lineItems: SelectFormOption[] = TravelperkAdvancedSettingService.getExpenseGroup();

  readonly brandingStyle = brandingStyle;

  constructor(
    private router: Router,
    private travelperkService: TravelperkService,
    private helper: HelperService,
    private toastService: IntegrationsToastService,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService,
    private translocoService: TranslocoService
  ) { }

  private formatMemoPreview(): void {
    const previewValues: { [key: string]: string } = {
      booker_name: 'John Doe',
      trip_name: 'Flight to West Lisaville, Jan 30 - Jan 31',
      traveler_name: 'Jane Doe',
      merchant_name: 'American Airlines',
      trip_id: '9788'
    };
    this.memoPreviewText = '';
    const memo: string[] = [];
    this.memoStructure.forEach((field, index) => {
      if (field in previewValues) {
        const defaultIndex = this.defaultMemoOptions.indexOf(this.memoStructure[index]);
        memo[defaultIndex] = previewValues[field];
      }
    });
    memo.forEach((field, index) => {
      this.memoPreviewText += field;
      if (index + 1 !== memo.length) {
        this.memoPreviewText = this.memoPreviewText + ' - ';
      }
    });
  }

  private createMemoStructureWatcher(): void {
    this.memoStructure = this.advancedSettingsForm.get('descriptionStructure')?.value;
    this.formatMemoPreview();
    this.advancedSettingsForm.controls.descriptionStructure.valueChanges.subscribe((memoChanges: string[]) => {
      this.memoStructure = memoChanges;
      this.formatMemoPreview();
    });
  }

  navigateBack(): void {
    this.router.navigate([`/integrations/travelperk/onboarding/payment_profile_settings`]);
  }

  constructPayloadAndSave() {
    this.isSaveInProgress = true;
    const advancedSettingsPayload = TravelperkAdvancedSettingService.createAdvancedSettingPayload(this.advancedSettingsForm);
    this.travelperkService.postTravelperkAdvancedSettings(advancedSettingsPayload).subscribe((travelperkAdvancedSettingsResponse: TravelperkAdvancedSettingGet) => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.SUCCESS, this.translocoService.translate('travelperkAdvancedSettings.advancedSettingsSuccess'));
      this.trackingService.trackTimeSpent(TrackingApp.TRAVELPERK, Page.ADVANCED_SETTINGS_TRAVELPERK, this.sessionStartTime);
      if (this.workspaceService.getOnboardingState() === TravelPerkOnboardingState.ADVANCED_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(TrackingApp.TRAVELPERK, TravelPerkOnboardingState.ADVANCED_SETTINGS, 3, advancedSettingsPayload);
      } else {
        this.trackingService.onUpdateEvent(
          TrackingApp.TRAVELPERK,
          TravelperkUpdateEvent.ADVANCED_SETTINGS_TRAVELPERK,
          {
            phase: this.helper.getPhase(this.isOnboarding),
            oldState: this.advancedSettings,
            newState: travelperkAdvancedSettingsResponse
          }
        );
      }

      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(TravelPerkOnboardingState.COMPLETE);
        this.router.navigate([`/integrations/travelperk/onboarding/done`]);
      }


    }, () => {
      this.isSaveInProgress = false;
      this.toastService.displayToastMessage(ToastSeverity.ERROR, this.translocoService.translate('travelperkAdvancedSettings.advancedSettingsError'));
    });
  }

  save(): void {
    if (this.advancedSettingsForm.valid) {
      this.constructPayloadAndSave();
    }
  }

  private setupPage(): void {
    this.isOnboarding = this.router.url.includes('onboarding');
    forkJoin([
      this.travelperkService.getTravelperkAdvancedSettings().pipe(catchError(() => of(null))),
      this.travelperkService.getCategories()
    ]).subscribe(([travelperkAdvancedSettingsResponse, travelperkDestinationAttribute]) => {
      this.advancedSettings = travelperkAdvancedSettingsResponse;
      this.defaultCategories = travelperkDestinationAttribute;
      this.advancedSettingsForm = TravelperkAdvancedSettingService.mapAPIResponseToFormGroup(this.advancedSettings, travelperkDestinationAttribute);
      this.createMemoStructureWatcher();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
