import { Injectable } from '@angular/core';
import { BusinessCentralOnboardingState, NetsuiteOnboardingState, BusinessCentralUpdateEvent, ClickEvent, IntacctOnboardingState, IntacctUpdateEvent, Page, QBDOnboardingState, Sage300OnboardingState, Sage300UpdateEvent, TrackingApp, TravelPerkOnboardingState, TravelperkUpdateEvent, UpdateEvent, QbdDirectOnboardingState, QbdDirectUpdateEvent } from '../../models/enum/enum.model';
import { MappingAlphabeticalFilterAdditionalProperty, ResolveMappingErrorProperty, UpdateEventAdditionalProperty, UpdateIntacctEventAdditionalProperty } from '../../models/misc/tracking.model';
import { QBDAdvancedSettingsPost } from '../../models/qbd/qbd-configuration/qbd-advanced-setting.model';
import { QBDExportSettingPost } from '../../models/qbd/qbd-configuration/qbd-export-setting.model';
import { QBDFieldMappingPost } from '../../models/qbd/qbd-configuration/qbd-field-mapping.model';
import { LocationEntityPost } from '../../models/intacct/intacct-configuration/connector.model';
import { ExportSettingPost } from '../../models/intacct/intacct-configuration/export-settings.model';
import { ImportSettingPost } from '../../models/intacct/intacct-configuration/import-settings.model';
import { AdvancedSettingsPost } from '../../models/intacct/intacct-configuration/advanced-settings.model';
import { Sage300ExportSettingPost } from '../../models/sage300/sage300-configuration/sage300-export-setting.model';
import { Sage300ImportSettingPost } from '../../models/sage300/sage300-configuration/sage300-import-settings.model';
import { Sage300AdvancedSettingPost } from '../../models/sage300/sage300-configuration/sage300-advanced-settings.model';
import { BusinessCentralExportSettingPost } from '../../models/business-central/business-central-configuration/business-central-export-setting.model';
import { BusinessCentralImportSettingsPost } from '../../models/business-central/business-central-configuration/business-central-import-settings.model';
import { BusinessCentralAdvancedSettingsPost } from '../../models/business-central/business-central-configuration/business-central-advanced-settings.model';
import { NetsuiteSubsidiaryMappingPost } from '../../models/netsuite/netsuite-configuration/netsuite-connector.model';
import { TravelperkPaymentProfileSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { TravelperkAdvancedSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';
import { QbdDirectAdvancedSettingsPost } from '../../models/qbd-direct/qbd-direct-configuration/qbd-direct-advanced-settings.model';
import { QbdDirectExportSettingsPost } from '../../models/qbd-direct/qbd-direct-configuration/qbd-direct-export-settings.model';
import { QbdDirectImportSettingPost } from '../../models/qbd-direct/qbd-direct-configuration/qbd-direct-import-settings.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private identityEmail: string | undefined;

  constructor() { }

  private flattenObject(ob: any): any {
    const toReturn: any = {};

    for (const i in ob) {
        if (!ob.hasOwnProperty(i)) {
          continue;
        }

        if ((typeof ob[i]) === 'object' && ob[i] !== null) {
          const flatObject = this.flattenObject(ob[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) {
                  continue;
                }

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

  get tracking() {
    return (window as any).mixpanel;
  }

  eventTrack(action: string, trackingApp?: TrackingApp, properties: any = {}): void {
    const flattenedObject = this.flattenObject(properties);
    properties = {
      ...flattenedObject,
      Asset: 'Integration Settings Web'
    };
    try {
      if (this.tracking) {
        this.tracking.track(`${trackingApp ? trackingApp : 'Integration Settings Web'}: ${action}`, properties);
      }
    } catch (e) {
      console.error('Tracking error:', e);
    }
  }

  onOpenLandingPage(userId: string | undefined, fyleOrgId: string): void {
    try {
      if (this.tracking) {
        this.tracking.identify(userId);
        this.tracking.people.set({
          fyleOrgId
        });
        this.identityEmail = userId;
      }
    } catch (e) {
      console.error('Tracking error:', e);
    }
    this.eventTrack('Opened Landing Page');
  }

  onLandingV2Open(): void {
    this.eventTrack('Opened Landing V2');
  }

  onClickEvent(trackingApp: TrackingApp, eventName: ClickEvent): void {
    this.eventTrack(`Click event: ${eventName}`, trackingApp, {});
  }

  trackTimeSpent(trackingApp: TrackingApp, page: Page, sessionStartTime: Date): void {
    const differenceInMs = new Date().getTime() - sessionStartTime.getTime();
    this.eventTrack(`Time Spent on ${page} page`, trackingApp, {durationInSeconds: differenceInMs / 1000});
  }

  onOnboardingStepCompletion(trackingApp: TrackingApp, eventName: QBDOnboardingState | Sage300OnboardingState | BusinessCentralOnboardingState | TravelPerkOnboardingState, stepNumber: number, additionalProperties: QBDExportSettingPost | QBDFieldMappingPost | QBDAdvancedSettingsPost | void | Sage300ExportSettingPost | Sage300ImportSettingPost | Sage300AdvancedSettingPost | BusinessCentralExportSettingPost | BusinessCentralImportSettingsPost | BusinessCentralAdvancedSettingsPost | TravelperkPaymentProfileSettingPost[] | TravelperkAdvancedSettingPost): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, trackingApp, additionalProperties);
  }

  integrationsOnboardingCompletion(trackingApp: TrackingApp, eventName: IntacctOnboardingState | NetsuiteOnboardingState | QbdDirectOnboardingState, stepNumber: number, additionalProperties: LocationEntityPost | ExportSettingPost | ImportSettingPost | AdvancedSettingsPost | NetsuiteSubsidiaryMappingPost | QbdDirectExportSettingsPost | QbdDirectImportSettingPost | QbdDirectAdvancedSettingsPost | void): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, trackingApp, additionalProperties);
  }

  onUpdateEvent(trackingApp: TrackingApp, eventName: UpdateEvent | Sage300UpdateEvent | BusinessCentralUpdateEvent | TravelperkUpdateEvent | QbdDirectUpdateEvent, additionalProperties: Partial<UpdateEventAdditionalProperty> | void): void {
    this.eventTrack(`Update event: ${eventName}`, trackingApp, additionalProperties);
  }

  intacctUpdateEvent (eventName: IntacctUpdateEvent, additionalProperties: Partial<UpdateIntacctEventAdditionalProperty> | void): void {
    this.eventTrack(`Update event: ${eventName}`, TrackingApp.INTACCT, additionalProperties);
  }

  onDateFilter(trackingApp: TrackingApp, properties: {filterType: 'existing' | 'custom', startDate: Date, endDate: Date}): void {
    this.eventTrack('Date filter', trackingApp, properties);
  }

  onMappingsAlphabeticalFilter(trackingApp: TrackingApp, properties: MappingAlphabeticalFilterAdditionalProperty): void {
    this.eventTrack('Mappings Alphabetical Filter', trackingApp, properties);
  }

  onErrorResolve(trackingApp: TrackingApp, properties: ResolveMappingErrorProperty): void {
    this.eventTrack('Resolve Mapping Error', trackingApp, properties);
  }

  onDropDownOpen(trackingApp: TrackingApp): void {
    this.eventTrack('Dropdown Open', trackingApp);
  }

  onDropDownItemClick(trackingApp: TrackingApp, options: { option: string }): void {
    this.eventTrack('Dropdown option clicked', trackingApp, options);
  }
}
