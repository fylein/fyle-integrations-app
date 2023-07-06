import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'fyle-integrations-ui-lib';
import { Org } from 'fyle-integrations-ui-lib';
import { StorageService } from 'fyle-integrations-ui-lib';
import { WindowService } from 'fyle-integrations-ui-lib';
import { TrackingService } from 'fyle-integrations-ui-lib';
import { UserService } from 'fyle-integrations-ui-lib';
import { OrgService } from 'fyle-integrations-ui-lib';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  windowReference: Window;

  user: MinimalUser | null;

  org: Org;

  constructor(
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
    this.user = this.userService.getUserProfile();
    this.getOrCreateOrg().then((org: Org | undefined) => {
      if (org) {
        this.trackingService.onOpenLandingPage(this.user?.email, org.id, org.name, org.fyle_org_id);
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
