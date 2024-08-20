import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowService } from 'src/app/core/services/common/window.service';

import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

xdescribe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/integrations/travelperk' };

  const service1 = {
    redirect: () => undefined
  };

  let routerMock = {
    snapshot: {
      queryParams: {
        state: 'travelperk_local_redirect',
        code: 'hehe'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routerMock
        },
        { provide: WindowService, useValue: service1 },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to Fyle oauth', () => {
    expect((component as any).redirectToFyleOAuth()).toBeUndefined();
  });

  it('should redirect to Fyle oauth by default if there are no query paramns', () => {
    routerMock = {
      snapshot: {
        queryParams: {
          state: 'hehe',
          code: 'heheasd'
        }
      }
    };
    expect(component.ngOnInit()).toBeUndefined();
  });
});
