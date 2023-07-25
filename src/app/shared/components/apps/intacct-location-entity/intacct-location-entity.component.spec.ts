import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctLocationEntityComponent } from './intacct-location-entity.component';

describe('IntacctLocationEntityComponent', () => {
  let component: IntacctLocationEntityComponent;
  let fixture: ComponentFixture<IntacctLocationEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctLocationEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctLocationEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
