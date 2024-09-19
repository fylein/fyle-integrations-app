import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ToastSeverity } from 'src/app/core/models/enum/enum.model';
import { IntegrationsToastService } from './integrations-toast.service';

xdescribe('IntegrationsToastService', () => {
  let service: IntegrationsToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ MessageService ]
    });
    service = TestBed.inject(IntegrationsToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('displayToastMessage function test', () => {
    expect(service.displayToastMessage(ToastSeverity.SUCCESS, 'Advanced settings saved successfully')).toBeUndefined();
  });
});
