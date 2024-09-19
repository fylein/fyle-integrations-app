import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { GenericMappingTableComponent } from './generic-mapping-table.component';

xdescribe('GenericMappingTableComponent', () => {
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
