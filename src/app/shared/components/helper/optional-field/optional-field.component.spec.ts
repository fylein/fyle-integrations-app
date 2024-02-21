import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalFieldComponent } from './optional-field.component';

describe('OptionalFieldComponent', () => {
  let component: OptionalFieldComponent;
  let fixture: ComponentFixture<OptionalFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionalFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
