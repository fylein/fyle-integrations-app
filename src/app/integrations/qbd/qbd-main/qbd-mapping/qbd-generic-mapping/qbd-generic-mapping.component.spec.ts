import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdGenericMappingComponent } from './qbd-generic-mapping.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IntegrationsToastService } from 'src/app/core/services/common/integrations-toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'primeng/api';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
import { of, throwError } from 'rxjs';
import { MappingState, OperatingSystem } from 'src/app/core/models/enum/enum.model';
import { WindowService } from 'src/app/core/services/common/window.service';
import { getMappingResponse, getMappingStatsResponse, postMappingPayload, postMappingResponse } from './qbd-generic-mapping.fixture';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('QbdGenericMappingComponent', () => {
  let component: QbdGenericMappingComponent;
  let fixture: ComponentFixture<QbdGenericMappingComponent>;

  let activatedRoute: ActivatedRoute;
  let mappingService: QbdMappingService;

  beforeEach(async () => {
    const service1 = {
      getMappings: () => of(getMappingStatsResponse),
      postMappings: () => of(postMappingResponse),
      getMappingStats: () => of(getMappingStatsResponse)
    };

    const service2 = {
      getOperatingSystem: () => OperatingSystem.MAC
    };

    const service3 = {
      displayToastMessage: () => undefined
    };
    await TestBed.configureTestingModule({
    declarations: [QbdGenericMappingComponent],
    imports: [RouterTestingModule, SharedModule, NoopAnimationsModule],
    providers: [QbdMappingService,
        { provide: QbdMappingService, useValue: service1 },
        { provide: WindowService, useValue: service2 },
        { provide: IntegrationsToastService, useValue: service3 }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(QbdGenericMappingComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    mappingService = TestBed.inject(QbdMappingService);
    component.mappings = getMappingResponse;
    component.filteredMappings = component.mappings.results.concat();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getOperatingSystem function check', () => {
    expect(component.getOperatingSystem()).toBeUndefined();
    expect(component.operationgSystem).toEqual(OperatingSystem.MAC);
  });

  it('mappingSeachingFilter function check', () => {
    component.mappings = getMappingResponse;
    expect(component.mappingSeachingFilter('bank')).toBeUndefined();
    expect(component.filteredMappings.length).toBe(1);
    expect(component.totalCount).toBe(1);
    expect(component.mappingSeachingFilter('')).toBeUndefined();
    expect(component.filteredMappings.length).toBe(3);
    expect(component.totalCount).toBe(3);
  });

  it('postMapping function check', () => {
    expect(component.postMapping(postMappingPayload)).toBeUndefined();
    spyOn(mappingService, 'postMappings').and.returnValue(throwError({Error}));
    expect(component.postMapping(postMappingPayload)).toBeUndefined();
  });

  it('pageSizeChanges function check', () => {
    spyOn(mappingService, 'getMappings').and.returnValue(of(getMappingResponse));
    const size = 50;
    expect(component.pageSizeChanges(size)).toBeUndefined();
    expect(component.limit).toBe(size);
    expect(component.currentPage).toBe(1);
  });

  it('pageOffsetChanges function check', () => {
    spyOn(mappingService, 'getMappings').and.returnValue(of(getMappingResponse));
    component.limit = 10;
    const offset = 2;
    expect(component.pageOffsetChanges(offset)).toBeUndefined();
    expect(component.pageNo).toBe(offset);
    expect(component.currentPage).toBe(2);
  });

  it('mappingStateFilter function check', () => {
    spyOn(mappingService, 'getMappings').and.returnValue(of(getMappingResponse));
    const state = MappingState.MAPPED;
    expect(component.mappingStateFilter(state)).toBeUndefined();
    expect(component.pageNo).toBe(0);
    expect(component.currentPage).toBe(1);
    expect(component.limit).toBe(10);
  });

  it('setupPage function check', () => {
    spyOn(mappingService, 'getMappings').and.returnValue(of(getMappingResponse));
    spyOn(mappingService, 'getMappingStats').and.returnValue(of(getMappingStatsResponse));
    expect(component.ngOnInit()).toBeUndefined();
    expect(component.operationgSystem).toEqual(OperatingSystem.MAC);
    expect(component.filteredMappings).toEqual(component.mappings.results);
    expect(component.mappings).toEqual(getMappingResponse);
    expect(component.totalCount).toEqual(getMappingResponse.count);
  });
});
