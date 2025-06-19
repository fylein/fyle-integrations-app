import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QbdDirectDownloadFileComponent', () => {
  let component: QbdDirectDownloadFileComponent;
  let fixture: ComponentFixture<QbdDirectDownloadFileComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      imports: [QbdDirectDownloadFileComponent, HttpClientModule, TranslocoModule],
      providers: [MessageService, { provide: TranslocoService, useValue: translocoServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectDownloadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
