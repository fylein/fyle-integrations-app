import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { QbdOnboardingDoneComponent } from './qbd-onboarding-done.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

describe('QbdOnboardingDoneComponent', () => {
  let component: QbdOnboardingDoneComponent;
  let fixture: ComponentFixture<QbdOnboardingDoneComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true,
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve(),
    });
    await TestBed.configureTestingModule({
      imports: [TranslocoModule],
      declarations: [QbdOnboardingDoneComponent],
      providers: [
        { provide: TranslocoService, useValue: translocoServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdOnboardingDoneComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateToDashboard function check', () => {
    expect(component.navigateToDashboard()).toBeUndefined();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/integrations/qbd/main']);
  });
});
