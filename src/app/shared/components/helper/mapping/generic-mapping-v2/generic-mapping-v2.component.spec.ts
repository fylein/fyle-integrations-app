import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingV2Component } from './generic-mapping-v2.component';

xdescribe('GenericMappingV2Component', () => {
  let component: GenericMappingV2Component;
  let fixture: ComponentFixture<GenericMappingV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMappingV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMappingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
