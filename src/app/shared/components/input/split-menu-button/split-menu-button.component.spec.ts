import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitMenuButtonComponent } from './split-menu-button.component';

describe('SplitMenuButtonComponent', () => {
  let component: SplitMenuButtonComponent;
  let fixture: ComponentFixture<SplitMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitMenuButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SplitMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
