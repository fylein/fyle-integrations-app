import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShimmersComponent } from './shimmers.component';

xdescribe('ShimmersComponent', () => {
  let component: ShimmersComponent;
  let fixture: ComponentFixture<ShimmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShimmersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShimmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
