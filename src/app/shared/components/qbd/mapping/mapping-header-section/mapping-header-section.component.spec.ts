//import { ComponentFixture, TestBed } from '@angular/core/testing';
//
//import { MappingHeaderSectionComponent } from './mapping-header-section.component';
//import { SnakeCaseToSpaceCasePipe } from 'src/app/shared/pipes/snake-case-to-space-case.pipe';
//import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';
//import { of } from 'rxjs';
//
//describe('MappingHeaderSectionComponent', () => {
//  let component: MappingHeaderSectionComponent;
//  let fixture: ComponentFixture<MappingHeaderSectionComponent>;
//
//  beforeEach(async () => {
//    const service1 = {
//      mappingStat: () => of()
//    };
//
//    await TestBed.configureTestingModule({
//      declarations: [ MappingHeaderSectionComponent, SnakeCaseToSpaceCasePipe ],
//      providers: [
//        { provide: QbdMappingService, useValue: service1 }
//      ]
//    })
//    .compileComponents();
//
//    fixture = TestBed.createComponent(MappingHeaderSectionComponent);
//    component = fixture.componentInstance;
//    component.mappingStats = {
//      all_attributes_count: 10,
//      unmapped_attributes_count: 10
//    };
//    fixture.detectChanges();
//  });
//
//  it('should create', () => {
//    expect(component).toBeTruthy();
//  });
//});
