import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingTableComponent } from './generic-mapping-table.component';

describe('GenericMappingTableComponent', () => {
  let component: GenericMappingTableComponent;
  let fixture: ComponentFixture<GenericMappingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMappingTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMappingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
