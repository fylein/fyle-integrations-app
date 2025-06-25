import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTokenExpiredComponent } from './dashboard-token-expired.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';

describe('DashboardTokenExpiredComponent', () => {
  let component: DashboardTokenExpiredComponent;
  let fixture: ComponentFixture<DashboardTokenExpiredComponent>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const translocoSpy = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [DashboardTokenExpiredComponent],
      imports: [HttpClientModule],
      providers: [MessageService, { provide: TranslocoService, useValue: translocoSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardTokenExpiredComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
