import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { compare } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RefinerSurveyType } from '../../models/enum/enum.model';
import { UserService } from '../misc/user.service';
import { RefinerService } from './refiner.service';
import { WorkspaceService } from '../common/workspace.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RefinerService', () => {
  let service: RefinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(RefinerService);
    (window as any)._refiner = () => {
      return undefined;
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
