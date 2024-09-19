import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { orgMockData } from '../core/services/org/org.fixture';
import { OrgService } from '../core/services/org/org.service';

import { IntegrationsComponent } from './integrations.component';

xdescribe('IntegrationsComponent', () => {
  let component: IntegrationsComponent;
  let fixture: ComponentFixture<IntegrationsComponent>;
  let orgService: OrgService;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/integrations/landing' };

  const service1 = {
    getOrgs: () => of(orgMockData),
    createOrg: () => of(orgMockData)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationsComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        { provide: OrgService, useValue: service1 },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationsComponent);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should create org if it doesn't exist`, () => {
    spyOn(orgService, 'getOrgs').and.returnValue(throwError('Org Not found'));
    expect((component as any).getOrCreateOrg()).toBeDefined();
  });

  it(`should create org is undefined`, () => {
    // @ts-ignore
    spyOn(orgService, 'getOrgs').and.returnValue(of(null));
    expect((component as any).getOrCreateOrg()).toBeDefined();
  });

  it('should navigate to integrations landing page', () => {
    // @ts-ignore
    component.windowReference = { location: { pathname: '/integrations' } };

    expect((component as any).navigate()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/landing']);
  });
});
