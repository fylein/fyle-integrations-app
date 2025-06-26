/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { QboMappingComponent } from './qbo-mapping.component';
import { MappingService } from 'src/app/core/services/common/mapping.service';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { FyleField } from 'src/app/core/models/enum/enum.model';
import { mockMappingSettings } from '../../qbo.fixture';
import { MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { TranslocoService } from '@jsverse/transloco';

describe('QboMappingComponent', () => {
  let component: QboMappingComponent;
  let fixture: ComponentFixture<QboMappingComponent>;
  let mappingServiceSpy: jasmine.SpyObj<MappingService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translocoService: jasmine.SpyObj<TranslocoService>;
  beforeEach(async () => {
    mappingServiceSpy = jasmine.createSpyObj('MappingService', ['getMappingSettings']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en')
    });
    await TestBed.configureTestingModule({
      declarations: [
        QboMappingComponent,
        SnakeCaseToSpaceCasePipe,
        SentenceCasePipe
      ],
      providers: [
        { provide: MappingService, useValue: mappingServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QboMappingComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should setup page correctly with additional mapping pages', fakeAsync(() => {
    const extendedMockMappingSettings = {
      ...mockMappingSettings,
      results: [
        ...mockMappingSettings.results,
        { source_field: FyleField.CATEGORY },
        { source_field: FyleField.VENDOR }
      ]
    };

    mappingServiceSpy.getMappingSettings.and.returnValue(of(extendedMockMappingSettings as MappingSettingResponse));

    component.ngOnInit();
    tick();

    expect(component.mappingPages.length).toBe(3);
    expect(component.mappingPages[0].label).toBe('Employee');
    expect(component.mappingPages[1].label).toBe('Category');
    expect(component.isLoading).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(component.mappingPages[0].routerLink);
  }));

  xit('should handle empty mapping settings response', fakeAsync(() => {
    mappingServiceSpy.getMappingSettings.and.returnValue(of({ results: [] } as unknown as MappingSettingResponse));

    component.ngOnInit();
    tick();

    expect(component.mappingPages.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(component.mappingPages[0].routerLink);
  }));

  it('should remove employee mapping page if feature flag is off', fakeAsync(() => {
    const originalFeatureFlag = brandingFeatureConfig.featureFlags.mapEmployees;
    brandingFeatureConfig.featureFlags.mapEmployees = false;

    translocoService.translate.and.returnValue('Category');
    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettings as unknown as MappingSettingResponse));

    component.ngOnInit();
    tick();

    expect(component.mappingPages.length).toBe(1);
    expect(component.mappingPages[0].label).toBe('Category');

    brandingFeatureConfig.featureFlags.mapEmployees = originalFeatureFlag;
  }));

  xit('should use SentenceCase for CO branding', fakeAsync(() => {
    const originalBrandId = brandingConfig.brandId;
    brandingConfig.brandId = 'co';

    const extendedMockMappingSettings = {
      ...mockMappingSettings,
      results: [
        ...mockMappingSettings.results,
        { source_field: FyleField.VENDOR }
      ]
    };

    mappingServiceSpy.getMappingSettings.and.returnValue(of(extendedMockMappingSettings as MappingSettingResponse));

    component.ngOnInit();
    tick();

    expect(component.mappingPages[2].label).toBe('Vendor');

    brandingConfig.brandId = originalBrandId;
  }));

  xit('should use TitleCase for non-CO branding', fakeAsync(() => {
    const originalBrandId = brandingConfig.brandId;
    brandingConfig.brandId = 'fyle';

    const extendedMockMappingSettings = {
      ...mockMappingSettings,
      results: [
        ...mockMappingSettings.results,
        { source_field: FyleField.VENDOR }
      ]
    };

    mappingServiceSpy.getMappingSettings.and.returnValue(of(extendedMockMappingSettings as MappingSettingResponse));

    component.ngOnInit();
    tick();

    expect(component.mappingPages[2].label).toBe('Vendor');

    brandingConfig.brandId = originalBrandId;
  }));
});