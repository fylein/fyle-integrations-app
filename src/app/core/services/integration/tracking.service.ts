import { Injectable } from '@angular/core';
import { ClickEvent, IntacctOnboardingState, IntacctUpdateEvent, Page, QBDOnboardingState, UpdateEvent } from '../../models/enum/enum.model';
import { UpdateEventAdditionalProperty, UpdateIntacctEventAdditionalProperty } from '../../models/misc/tracking.model';
import { QBDAdvancedSettingsPost } from '../../models/qbd/qbd-configuration/advanced-setting.model';
import { QBDExportSettingPost } from '../../models/qbd/qbd-configuration/export-setting.model';
import { QBDFieldMappingPost } from '../../models/qbd/qbd-configuration/field-mapping.model';
import { LocationEntityPost } from '../../models/si/si-configuration/connector.model';
import { ExportSettingPost } from '../../models/si/si-configuration/export-settings.model';
import { ImportSettingPost } from '../../models/si/si-configuration/import-settings.model';

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

  eventTrack(action: string, properties: any = {}): void {
    const flattenedObject = this.flattenObject(properties);
    properties = {
      ...flattenedObject,
      Asset: 'Integration Settings Web'
    };
    if (this.tracking) {
      this.tracking.track(action, properties);
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

  onClickEvent(eventName: ClickEvent): void {
    this.eventTrack(`Click event: ${eventName}`);
  }

  onErrorPage(): void {
    this.eventTrack('Error Page shown');
  }

  trackTimeSpent(page: Page, sessionStartTime: Date): void {
    const differenceInMs = new Date().getTime() - sessionStartTime.getTime();
    this.eventTrack(`Time Spent on ${page} page`, {durationInSeconds: differenceInMs / 1000});
  }

  onOnboardingStepCompletion(eventName: QBDOnboardingState, stepNumber: number, additionalProperties: QBDExportSettingPost | QBDFieldMappingPost | QBDAdvancedSettingsPost | void): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, additionalProperties);
  }

  integrationsOnboardingCompletion(eventName: IntacctOnboardingState, stepNumber: number, additionalProperties: LocationEntityPost | ExportSettingPost | ImportSettingPost | void): void {
    this.eventTrack(`Step ${stepNumber} completed: ${eventName}`, additionalProperties);
  }

  onUpdateEvent(eventName: UpdateEvent, additionalProperties: Partial<UpdateEventAdditionalProperty> | void): void {
    this.eventTrack(`Update event: ${eventName}`, additionalProperties);
  }

  intacctUpdateEvent (eventName: IntacctUpdateEvent, additionalProperties: Partial<UpdateIntacctEventAdditionalProperty> | void): void {
    this.eventTrack(`Update event: ${eventName}`, additionalProperties);
  }
}
