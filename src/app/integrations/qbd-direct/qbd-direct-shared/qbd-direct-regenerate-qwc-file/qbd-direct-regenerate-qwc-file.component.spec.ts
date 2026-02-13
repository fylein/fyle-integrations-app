import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectRegenerateQWCFileComponent } from './qbd-direct-regenerate-qwc-file.component';

describe('QbdDirectRegenerateQwcFileComponent', () => {
  let component: QbdDirectRegenerateQWCFileComponent;
  let fixture: ComponentFixture<QbdDirectRegenerateQWCFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectRegenerateQWCFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectRegenerateQWCFileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
