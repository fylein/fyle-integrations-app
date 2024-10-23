import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectComponent } from './qbd-direct.component';

describe('QbdDirectComponent', () => {
  let component: QbdDirectComponent;
  let fixture: ComponentFixture<QbdDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
