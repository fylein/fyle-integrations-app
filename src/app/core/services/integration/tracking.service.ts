import { Injectable } from '@angular/core';
import { BusinessCentralOnboardingState, BusinessCentralUpdateEvent, ClickEvent, IntacctOnboardingState, IntacctUpdateEvent, Page, QBDOnboardingState, Sage300OnboardingState, Sage300UpdateEvent, TrackingApp, TravelPerkOnboardingState, TravelperkUpdateEvent, UpdateEvent } from '../../models/enum/enum.model';
import { MappingAlphabeticalFilterAdditionalProperty, ResolveMappingErrorProperty, UpdateEventAdditionalProperty, UpdateIntacctEventAdditionalProperty } from '../../models/misc/tracking.model';
import { QBDAdvancedSettingsPost } from '../../models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingPost } from '../../models/qbd/qbd-configuration/export-setting.model';
import { QBDFieldMappingPost } from '../../models/qbd/qbd-configuration/field-mapping.model';
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
import { TravelperkPaymentProfileSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-payment-profile-settings.model';
import { TravelperkAdvancedSettingPost } from '../../models/travelperk/travelperk-configuration/travelperk-advanced-settings.model';

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
    return (window as any).analytics;
  }

  eventTrack(action: string, trackingApp?: TrackingApp, properties: any = {}): void {
    const flattenedObject = this.flattenObject(properties);
    properties = {
      ...flattenedObject,
      Asset: 'Integration Settings Web'
    };
    if (this.tracking) {
      this.tracking.track(`${trackingApp ? trackingApp : 'Integration Settings Web'}: ${action}`, properties);
    }
  }

  onOpenLandingPage(email: string | undefined, orgId: number, orgName: string, fyleOrgId: string): void {
    if (this.tracking) {
      this.tracking.identify(email, {
        orgId,
        orgName,
        fyleOrgId
      });
      this.identityEmail = email;
    }
    this.eventTrack('Opened Landing Page');
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

  integrationsOnboardingCompletion(trackingApp: TrackingApp, eventName: IntacctOnboardingState, stepNumber: number, additionalProperties: LocationEntityPost | ExportSettingPost | ImportSettingPost | AdvancedSettingsPost | void): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, trackingApp, additionalProperties);
  }

  onUpdateEvent(trackingApp: TrackingApp, eventName: UpdateEvent | Sage300UpdateEvent | BusinessCentralUpdateEvent | TravelperkUpdateEvent, additionalProperties: Partial<UpdateEventAdditionalProperty> | void): void {
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
}
