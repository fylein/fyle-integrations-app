import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { QbdWorkspaceService } from 'src/app/core/services/qbd/qbd-core/qbd-workspace.service';

import { QbdComponent } from './qbd.component';
import { errorResponse, workspaceResponse } from './qbd.fixture';
import { TranslocoService } from '@jsverse/transloco';

describe('QbdComponent', () => {
  let component: QbdComponent;
  let fixture: ComponentFixture<QbdComponent>;
  let workspace: QbdWorkspaceService;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const localStorageDump = {
      email: 'fyle@fyle.in',
      org_id: '2',
    };
    localStorage.setItem('user', JSON.stringify(localStorageDump));
    const service1 = {
      getQBDWorkspace: () => of(workspaceResponse),
      postQBDWorkspace: () => of(workspaceResponse),
      syncFyleDimensions: () => of({}),
    };
    const translocoSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [QbdComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: QbdWorkspaceService, useValue: service1 },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: TranslocoService, useValue: translocoSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdComponent);
    component = fixture.componentInstance;
    workspace = TestBed.inject(QbdWorkspaceService);
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnIng function check', async () => {
    expect((component as any).setupWorkspace()).toBeUndefined();
  });

  it('workspace error handling', () => {
    spyOn(workspace, 'getQBDWorkspace').and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    expect((component as any).setupWorkspace()).toBeUndefined();
  });
});
