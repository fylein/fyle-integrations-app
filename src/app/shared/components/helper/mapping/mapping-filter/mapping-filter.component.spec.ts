import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFilterComponent } from './mapping-filter.component';
import { UntypedFormBuilder } from '@angular/forms';
import { MappingState } from 'src/app/core/models/enum/enum.model';

xdescribe('MappingFilterComponent', () => {
  let component: MappingFilterComponent;
  let fixture: ComponentFixture<MappingFilterComponent>;
  let formbuilder: UntypedFormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingFilterComponent ],
      providers: [ UntypedFormBuilder ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingFilterComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(UntypedFormBuilder);
    component.form = formbuilder.group({
      searchOption: ['efe'],
      filterOption: ['jkjk']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.mappingFilter = MappingState.ALL;
    expect(component.ngOnInit()).toBeUndefined();
  });

  it('clearSearch function check', () => {
    expect(component.form.controls.searchOption.value).toBeNull();
  });

  it('onFocusOut function check', () => {
    const event = {
      target: {
        value: 'Fyle'
      }
    };
  });

  it('getSelectedFilterClass function check', () => {
    expect(component.getSelectedFilterClass(MappingState.UNMAPPED)).toContain(MappingState.UNMAPPED.toLowerCase());
    expect(component.getSelectedFilterClass(MappingState.MAPPED)).toContain(MappingState.MAPPED.toLowerCase());
    expect(component.getSelectedFilterClass(MappingState.ALL)).toContain(MappingState.UNMAPPED.toLowerCase());
  });

  it('filterChanges function check', () => {
    expect(component.filterChanges()).toBeUndefined();
    component.form.controls.filterOption.patchValue('sedd');
    expect(component.filterChanges()).toBeUndefined();
  });

  it('removeFilter function check', () => {
    expect(component.removeFilter()).toBeUndefined();
    expect(component.form.controls.filterOption.value).toBe('');
  });
});
