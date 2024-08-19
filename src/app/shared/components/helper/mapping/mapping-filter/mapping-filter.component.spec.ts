//// import { ComponentFixture, TestBed } from '@angular/core/testing';
//
//// import { MappingFilterComponent } from './mapping-filter.component';
//// import { UntypedFormBuilder } from '@angular/forms';
//// import { MappingState } from 'src/app/core/models/enum/enum.model';
//
//// describe('MappingFilterComponent', () => {
////   let component: MappingFilterComponent;
////   let fixture: ComponentFixture<MappingFilterComponent>;
////   let formbuilder: UntypedFormBuilder;
//
////   beforeEach(async () => {
////     await TestBed.configureTestingModule({
////       declarations: [ MappingFilterComponent ],
////       providers: [ UntypedFormBuilder ]
////     })
////     .compileComponents();
//
////     fixture = TestBed.createComponent(MappingFilterComponent);
////     component = fixture.componentInstance;
////     formbuilder = TestBed.inject(UntypedFormBuilder);
////     component.form = formbuilder.group({
////       searchOption: ['efe'],
////       filterOption: ['jkjk']
////     });
////     fixture.detectChanges();
////   });
//
////   it('should create', () => {
////     expect(component).toBeTruthy();
////     component.mappingFilter = MappingState.ALL;
////     expect(component.ngOnInit()).toBeUndefined();
////   });
//
////   it('clearSearch function check', () => {
////     expect(component.clearSearch()).toBeUndefined();
////     expect(component.isSearchBoxActive).toBeFalse();
////     expect(component.form.controls.searchOption.value).toBeNull();
////   });
//
////   it('onFocusOut function check', () => {
////     const event = {
////       target: {
////         value: 'Fyle'
////       }
////     };
////     expect(component.onFocusOut(event)).toBeUndefined();
////     expect(component.isSearchBoxActive).toBeTrue();
////   });
//
////   it('getSelectedFilter function check', () => {
////     expect(component.getSelectedFilter(MappingState.UNMAPPED)).toBe(MappingState.UNMAPPED.toLowerCase());
////     expect(component.getSelectedFilter(MappingState.MAPPED)).toBe(MappingState.MAPPED.toLowerCase());
////     expect(component.getSelectedFilter(MappingState.ALL)).toBe(MappingState.UNMAPPED.toLowerCase());
////   });
//
////   it('filterChanges function check', () => {
////     expect(component.filterChanges()).toBeUndefined();
////     component.form.controls.filterOption.patchValue('sedd');
////     expect(component.filterChanges()).toBeUndefined();
////   });
//
////   it('removeFilter function check', () => {
////     expect(component.removeFilter()).toBeUndefined();
////     expect(component.form.controls.filterOption.value).toBe('');
////   });
//// });
