import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountingIntegrationApp, IntegrationView } from 'src/app/core/models/enum/enum.model';
import { EventsService } from 'src/app/core/services/core/events.service';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let eventsService: EventsService;

  const service1 = {
    postEvent: () => null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      providers: [
        { provide: EventsService, useValue: service1 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    eventsService = TestBed.inject(EventsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch view based on selection', () => {
    expect(component.integrationTabs.ALL).toBeTrue();
    component.switchView(IntegrationView.ACCOUNTING);
    expect(component.integrationTabs.ACCOUNTING).toBeTrue();
    expect(component.integrationTabs.ALL).toBeFalse();
  });

  it('should open Accounting Integration App', () => {
    component.openAccountingIntegrationApp(AccountingIntegrationApp.NETSUITE);
  });
});
