import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMappingHeaderSectionComponent } from './qbd-mapping-header-section.component';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-core/qbd-mapping.service';
import { of } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QbdMappingHeaderSectionComponent', () => {
  let component: QbdMappingHeaderSectionComponent;
  let fixture: ComponentFixture<QbdMappingHeaderSectionComponent>;
  let translocoService: jasmine.SpyObj<TranslocoService>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true,
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve(),
    });
    const service1 = {
      mappingStat: () => of(),
    };

    await TestBed.configureTestingModule({
      imports: [TranslocoModule],
      declarations: [QbdMappingHeaderSectionComponent, SnakeCaseToSpaceCasePipe],
      providers: [
        { provide: QbdMappingService, useValue: service1 },
        { provide: TranslocoService, useValue: translocoServiceSpy },
      ],
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;

    fixture = TestBed.createComponent(QbdMappingHeaderSectionComponent);
    component = fixture.componentInstance;
    component.mappingStats = {
      all_attributes_count: 10,
      unmapped_attributes_count: 10,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
