import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SiComponent } from './si.component';
import { errorResponse, workspaceResponse } from './si.fixture';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

describe('SiComponent', () => {
  let component: SiComponent;
  let fixture: ComponentFixture<SiComponent>;
  let workspace: SiWorkspaceService;

  beforeEach(async () => {
  const localStorageDump = {
    email: 'anishkumar.s@fyle.in',
    org_id: 'abcdefgh'
  };
  localStorage.setItem('user', JSON.stringify(localStorageDump));
  const service1 = {
    getWorkspace: () => of(workspaceResponse),
    postWorkspace: () => of(workspaceResponse)
  };
  await TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule],
    declarations: [ SiComponent ],
    providers: [
      { provide: SiWorkspaceService, useValue: service1 }
    ]
  })
  .compileComponents();

  fixture = TestBed.createComponent(SiComponent);
  component = fixture.componentInstance;
  workspace = TestBed.inject(SiWorkspaceService);
  fixture.detectChanges();
});

it('should create', () => {
  expect(component).toBeTruthy();
});

it('ngOnIng function check', async () => {
  expect((component as any).getOrCreateWorkspace()).toBeUndefined();
});

it('workspace error handling', () => {
  spyOn(workspace, 'getWorkspace').and.returnValue(throwError(errorResponse));
  fixture.detectChanges();
  expect((component as any).getOrCreateWorkspace()).toBeUndefined();
});
});
