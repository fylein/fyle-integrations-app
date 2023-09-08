import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingComponent } from './generic-mapping.component';

describe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
