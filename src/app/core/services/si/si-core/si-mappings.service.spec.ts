import { TestBed } from '@angular/core/testing';
import { SiMappingsService } from './si-mappings.service';
import { SiWorkspaceService } from './si-workspace.service';
import { Observable, of } from 'rxjs'; // Import Observable and of
import { ApiService } from '../../common/api.service';

xdescribe('SiMappingsService', () => {
  let service: SiMappingsService;
  let mockApiService: jasmine.SpyObj<ApiService>; // Create a spy object for ApiService
  let mockWorkspaceService: jasmine.SpyObj<SiWorkspaceService>; // Create a spy object for SiWorkspaceService

  beforeEach(() => {
    // Create spy objects
    const apiSpy = jasmine.createSpyObj('ApiService', ['post', 'get']);
    const workspaceSpy = jasmine.createSpyObj('SiWorkspaceService', ['getWorkspaceId']);

    TestBed.configureTestingModule({
      providers: [
        SiMappingsService,
        { provide: ApiService, useValue: apiSpy },
        { provide: SiWorkspaceService, useValue: workspaceSpy }
      ]
    });

    service = TestBed.inject(SiMappingsService);
    mockApiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    mockWorkspaceService = TestBed.inject(SiWorkspaceService) as jasmine.SpyObj<SiWorkspaceService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post method with correct parameters for refreshSageIntacctDimensions', () => {
    const dimensionsToSync = ['dimension1', 'dimension2'];
    const workspaceId = 'workspace123';
    mockWorkspaceService.getWorkspaceId.and.returnValue(workspaceId);

    service.refreshSageIntacctDimensions(dimensionsToSync);

    expect(mockApiService.post).toHaveBeenCalledWith(`/workspaces/${workspaceId}/sage_intacct/refresh_dimensions/`, {
      dimensions_to_sync: dimensionsToSync
    });
  });

  it('should call get method with correct parameters for getSageIntacctDestinationAttributes', () => {
    const attributeTypes = ['attribute1', 'attribute2'];
    const workspaceId = 'workspace123';
    mockWorkspaceService.getWorkspaceId.and.returnValue(workspaceId);
    mockApiService.get.and.returnValue(of([])); // Mock the response

    service.getSageIntacctDestinationAttributes(attributeTypes, 'accountType', true);

    expect(mockApiService.get).toHaveBeenCalledWith(`/workspaces/${workspaceId}/sage_intacct/destination_attributes/`, {
      attribute_types: attributeTypes,
      account_type: 'accountType',
      active: true
    });
  });
});
