import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteMappingComponent } from './netsuite-mapping.component';

xdescribe('NetsuiteMappingComponent', () => {
  let component: NetsuiteMappingComponent;
  let fixture: ComponentFixture<NetsuiteMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
