import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChechboxButtonComponent } from './chechbox-button.component';

describe('ChechboxButtonComponent', () => {
  let component: ChechboxButtonComponent;
  let fixture: ComponentFixture<ChechboxButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChechboxButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChechboxButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
