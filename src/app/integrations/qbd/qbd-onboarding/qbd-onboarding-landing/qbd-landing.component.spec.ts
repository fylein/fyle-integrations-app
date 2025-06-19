import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdLandingComponent } from './qbd-landing.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QbdLandingComponent', () => {
  let component: QbdLandingComponent;
  let fixture: ComponentFixture<QbdLandingComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [TranslocoModule],
      declarations: [ QbdLandingComponent ],
      providers: [
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
