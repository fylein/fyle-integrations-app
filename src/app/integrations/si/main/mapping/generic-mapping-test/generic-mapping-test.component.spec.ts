import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingTestComponent } from './generic-mapping-test.component';

describe('GenericMappingTestComponent', () => {
  let component: GenericMappingTestComponent;
  let fixture: ComponentFixture<GenericMappingTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMappingTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMappingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
