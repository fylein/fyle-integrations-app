import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

describe('QbdDirectDownloadFileComponent', () => {
  let component: QbdDirectDownloadFileComponent;
  let fixture: ComponentFixture<QbdDirectDownloadFileComponent>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve()
    });

    await TestBed.configureTestingModule({
      imports: [QbdDirectDownloadFileComponent, HttpClientModule, TranslocoModule],
      providers: [MessageService, { provide: TranslocoService, useValue: translocoServiceSpy }]
    })
    .compileComponents();

    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    fixture = TestBed.createComponent(QbdDirectDownloadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
