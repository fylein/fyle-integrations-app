import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMappingHeaderSectionComponent } from './qbd-mapping-header-section.component';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { of } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

describe('QbdMappingHeaderSectionComponent', () => {
  let component: QbdMappingHeaderSectionComponent;
  let fixture: ComponentFixture<QbdMappingHeaderSectionComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);
    const service1 = {
      mappingStat: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [TranslocoModule],
      declarations: [ QbdMappingHeaderSectionComponent, SnakeCaseToSpaceCasePipe ],
      providers: [
        { provide: QbdMappingService, useValue: service1 },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdMappingHeaderSectionComponent);
    component = fixture.componentInstance;
    component.mappingStats = {
      all_attributes_count: 10,
      unmapped_attributes_count: 10
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
