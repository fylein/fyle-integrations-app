import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { MappingCardHeaderComponent } from './mapping-card-header.component';

xdescribe('MappingCardHeaderComponent', () => {
  let component: MappingCardHeaderComponent;
  let fixture: ComponentFixture<MappingCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingCardHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
