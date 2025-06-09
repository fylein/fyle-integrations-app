import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutlinedIconButtonComponent } from './outlined-icon-button.component';

describe('OutlinedIconButtonComponent', () => {
  let component: OutlinedIconButtonComponent;
  let fixture: ComponentFixture<OutlinedIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutlinedIconButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutlinedIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});