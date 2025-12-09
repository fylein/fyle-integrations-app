import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTokenExpiredComponent } from './dashboard-token-expired.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

describe('DashboardTokenExpiredComponent', () => {
  let component: DashboardTokenExpiredComponent;
  let fixture: ComponentFixture<DashboardTokenExpiredComponent>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true,
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve(),
    });

    await TestBed.configureTestingModule({
      declarations: [DashboardTokenExpiredComponent],
      imports: [HttpClientModule, TranslocoModule],
      providers: [MessageService, { provide: TranslocoService, useValue: translocoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardTokenExpiredComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
