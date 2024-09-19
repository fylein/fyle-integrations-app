import { TestBed } from '@angular/core/testing';
import { IntacctConnectorService } from './intacct-connector.service';
import { SiWorkspaceService } from './si-workspace.service';
import { StorageService } from '../../common/storage.service';
import { of } from 'rxjs';
import { ApiService } from '../../common/api.service';

xdescribe('IntacctConnectorService', () => {
  let service: IntacctConnectorService;
  let mockApiService: Partial<ApiService>;
  let mockWorkspaceService: Partial<SiWorkspaceService>;
  let mockStorageService: Partial<StorageService>;

  beforeEach(() => {
    mockApiService = {
      get: () => of({}),
      post: () => of({})
    };
    mockWorkspaceService = {
      getWorkspaceId: () => '1'
    };
    mockStorageService = {
      get: () => 1
    };

    TestBed.configureTestingModule({
      providers: [
        IntacctConnectorService,
        { provide: ApiService, useValue: mockApiService },
        { provide: SiWorkspaceService, useValue: mockWorkspaceService },
        { provide: StorageService, useValue: mockStorageService }
      ]
    });

    service = TestBed.inject(IntacctConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get SageIntacctCredential', () => {
    const credentialData = {
      id: 1,
      si_user_id: 'user123',
      si_company_id: 'company123',
      si_company_name: 'Company Name',
      si_user_password: 'password123',
      created_at: new Date(),
      updated_at: new Date(),
      workspace: 1
    };
    mockApiService.get = () => of(credentialData);

    const credential$ = service.getSageIntacctCredential();

    credential$.subscribe((credential) => {
      expect(credential).toEqual(credentialData);
    });
  });
});
