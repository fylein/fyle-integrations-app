import { Injectable } from '@angular/core';
import { ClickEvent, Page } from '../../models/enum/enum.model';

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
    this.eventTrack(`Time Spent on ${page} page`, {durationInSeconds: differenceInMs});
  }
}
