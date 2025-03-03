import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { IntacctMappingComponent } from './intacct-mapping.component';
import { SiMappingsService } from 'src/app/core/services/si/si-core/si-mappings.service';
import { brandingConfig, brandingFeatureConfig } from 'src/app/branding/branding-config';
import { mockMappingSettingsResponse, mockMappingSettingsWithCustomFieldResponse } from '../../intacct.fixture';
import { MappingSettingResponse } from 'src/app/core/models/intacct/db/mapping-setting.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { c1FeatureConfig } from 'src/app/branding/c1-branding-config';
import { fyleFeatureConfig } from 'src/app/branding/fyle-branding-config';

describe('IntacctMappingComponent', () => {
  let component: IntacctMappingComponent;
  let router: Router;
  let fixture: ComponentFixture<IntacctMappingComponent>;
  let mappingServiceSpy: jasmine.SpyObj<SiMappingsService>;

  beforeEach(async () => {
    mappingServiceSpy = jasmine.createSpyObj('SiMappingsService', ['getMappingSettings']);

    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterModule.forRoot([])],
      declarations: [ IntacctMappingComponent ],
      providers: [
        provideRouter([]),
        { provide: SiMappingsService, useValue: mappingServiceSpy }
      ]
    }).compileComponents();

    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettingsResponse as MappingSettingResponse));
    brandingConfig.brandId = 'fyle';
    brandingFeatureConfig.featureFlags.mapEmployees = true;

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(IntacctMappingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect(component.mappingPages.length).toBe(3);
    expect(component.activeModule).toEqual(component.mappingPages[0]);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/integrations/intacct/main/mapping/employee');
  });

  it('should handle custom mapping fields', () => {
    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettingsWithCustomFieldResponse as MappingSettingResponse));
    fixture.detectChanges();

    expect(component.mappingPages.length).toBe(4);
    expect(component.mappingPages[3].label).toBe('Sample custom Field');
    expect(component.mappingPages[3].routerLink).toBe('/integrations/intacct/main/mapping/sample_custom_field');
  });

  it('should not include employee mapping when the feature is disabled', () => {
    brandingFeatureConfig.featureFlags.mapEmployees = false;
    fixture.detectChanges();

    expect(component.mappingPages.length).toBe(2);
    expect(component.mappingPages[0].label).not.toBe('Employee');
  });

  it('should handle different branding configurations', () => {
    mappingServiceSpy.getMappingSettings.and.returnValue(of(mockMappingSettingsWithCustomFieldResponse as MappingSettingResponse));
    brandingConfig.brandId = 'co';
    brandingFeatureConfig.featureFlags.exportSettings.transformContentToSentenceCase = c1FeatureConfig.featureFlags.exportSettings.transformContentToSentenceCase;

    fixture.detectChanges();

    expect(component.mappingPages[3].label).toBe('Sample custom field');

    brandingFeatureConfig.featureFlags.exportSettings.transformContentToSentenceCase = fyleFeatureConfig.featureFlags.exportSettings.transformContentToSentenceCase;
  });
});