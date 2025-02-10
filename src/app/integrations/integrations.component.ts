import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from '../core/models/db/user.model';
import { Org } from '../core/models/org/org.model';
import { StorageService } from '../core/services/common/storage.service';
import { WindowService } from '../core/services/common/window.service';
import { TrackingService } from '../core/services/integration/tracking.service';
import { UserService } from '../core/services/misc/user.service';
import { OrgService } from '../core/services/org/org.service';
import { EventsService } from '../core/services/common/events.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  windowReference: Window;

  user: MinimalUser | null;

  org: Org;

  isLoading: boolean = true;

  constructor(
    private eventsService: EventsService,
    private orgService: OrgService,
    private router: Router,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    this.isLoading = false;
    if (pathName === '/integrations') {
      this.router.navigate(['/integrations/landing']);
    }
  }

  private getOrCreateOrg(): Promise<Org | undefined> {
    return this.orgService.getOrgs(this.user?.org_id).toPromise().then(orgs => {
      if (orgs) {
        return orgs;
      }

      return undefined;
    }).catch(() => {
      return this.orgService.createOrg().toPromise().then(org => {
        return org;
      });
    });
  }

  private setupOrg(): void {
    this.eventsService.setupRouteWatcher();
    this.user = this.userService.getUserProfile();
    this.getOrCreateOrg().then((org: Org | undefined) => {
      if (org) {
        this.trackingService.onOpenLandingPage(this.user?.user_id, org.id, org.name);
        this.org = org;
        this.storageService.set('orgId', this.org.id);
        this.storageService.set('org', this.org);
      }
      this.navigate();
    });
  }

  ngOnInit(): void {
    this.setupOrg();
  }

}
