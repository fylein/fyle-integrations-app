import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctMappingComponent } from './intacct-mapping.component';

xdescribe('IntacctMappingComponent', () => {
  let component: IntacctMappingComponent;
  let fixture: ComponentFixture<IntacctMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
