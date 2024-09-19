import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { IntacctBaseMappingComponent } from './intacct-base-mapping.component';

xdescribe('IntacctBaseMappingComponent', () => {
  let component: IntacctBaseMappingComponent;
  let fixture: ComponentFixture<IntacctBaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctBaseMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctBaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
