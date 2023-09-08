import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFilterComponent } from './mapping-filter.component';

describe('MappingFilterComponent', () => {
  let component: MappingFilterComponent;
  let fixture: ComponentFixture<MappingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
