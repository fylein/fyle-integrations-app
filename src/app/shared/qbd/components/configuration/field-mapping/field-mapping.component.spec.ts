import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldMappingComponent } from './field-mapping.component';

describe('FieldMappingComponent', () => {
  let component: FieldMappingComponent;
  let fixture: ComponentFixture<FieldMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
