import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingHeaderSectionComponent } from './mapping-header-section.component';

describe('MappingHeaderSectionComponent', () => {
  let component: MappingHeaderSectionComponent;
  let fixture: ComponentFixture<MappingHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingHeaderSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
