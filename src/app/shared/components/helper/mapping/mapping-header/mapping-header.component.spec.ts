import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingHeaderComponent } from './mapping-header.component';

describe('MappingHeaderComponent', () => {
  let component: MappingHeaderComponent;
  let fixture: ComponentFixture<MappingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
