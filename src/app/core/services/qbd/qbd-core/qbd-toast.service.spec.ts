import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { QbdToastService } from './qbd-toast.service';

describe('QbdToastService', () => {
  let service: QbdToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MessageService ]
    });
    service = TestBed.inject(QbdToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('displayToastMessage function test', () => {
    expect(service.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully')).toBeUndefined();
  });
});
