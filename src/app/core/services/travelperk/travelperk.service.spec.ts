import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { travelperkMockData } from './travelperk.fixture';

import { TravelperkService } from './travelperk.service';

describe('TravelperkService', () => {
  let service: TravelperkService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelperkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get travelperk data', () => {
    service.getTravelperkData().subscribe((res) => {
      expect(res).toEqual(travelperkMockData);
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/orgs/1/travelperk/`
    });

    req.flush(travelperkMockData);
  });

  it('should create folder', () => {
    service.createFolder().subscribe((res) => {
      console.log(res)
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/travelperk/folder/`
    });

    req.flush({});
  });

  it('should upload package', () => {
    service.uploadPackage().subscribe((res) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/orgs/1/travelperk/packages/`
    });

    req.flush({});
  });
});
