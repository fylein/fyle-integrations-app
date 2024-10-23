import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300MappingComponent } from './sage300-mapping.component';

xdescribe('Sage300MappingComponent', () => {
  let component: Sage300MappingComponent;
  let fixture: ComponentFixture<Sage300MappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300MappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300MappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
