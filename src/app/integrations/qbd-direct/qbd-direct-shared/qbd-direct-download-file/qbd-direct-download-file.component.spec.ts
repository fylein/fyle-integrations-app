import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectDownloadFileComponent } from './qbd-direct-download-file.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

describe('QbdDirectDownloadFileComponent', () => {
  let component: QbdDirectDownloadFileComponent;
  let fixture: ComponentFixture<QbdDirectDownloadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectDownloadFileComponent, HttpClientModule],
      providers: [MessageService]
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
