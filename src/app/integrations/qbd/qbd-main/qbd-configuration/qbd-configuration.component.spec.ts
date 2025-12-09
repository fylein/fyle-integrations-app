import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdConfigurationComponent } from './qbd-configuration.component';
import { TranslocoService } from '@jsverse/transloco';

describe('QbdConfigurationComponent', () => {
  let component: QbdConfigurationComponent;
  let fixture: ComponentFixture<QbdConfigurationComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [QbdConfigurationComponent],
      providers: [{ provide: TranslocoService, useValue: translocoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
