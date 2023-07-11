import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMappingComponent } from './category-mapping.component';

describe('CategoryMappingComponent', () => {
  let component: CategoryMappingComponent;
  let fixture: ComponentFixture<CategoryMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
