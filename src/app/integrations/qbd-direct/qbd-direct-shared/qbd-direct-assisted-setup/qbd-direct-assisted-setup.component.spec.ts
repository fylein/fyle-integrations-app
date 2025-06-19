import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QbdDirectAssistedSetupComponent } from './qbd-direct-assisted-setup.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QbdDirectAssistedSetupComponent', () => {
  let component: QbdDirectAssistedSetupComponent;
  let fixture: ComponentFixture<QbdDirectAssistedSetupComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [ QbdDirectAssistedSetupComponent ],
      imports: [HttpClientModule, TranslocoModule],
      providers: [MessageService, { provide: TranslocoService, useValue: translocoServiceSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbdDirectAssistedSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});