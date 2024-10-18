import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectSharedComponent } from './qbd-direct-shared.component';

describe('QbdDirectSharedComponent', () => {
  let component: QbdDirectSharedComponent;
  let fixture: ComponentFixture<QbdDirectSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectSharedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
