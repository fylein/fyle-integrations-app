import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectRegenerateQwcFileComponent } from './qbd-direct-regenerate-qwc-file.component';

describe('QbdDirectRegenerateQwcFileComponent', () => {
  let component: QbdDirectRegenerateQwcFileComponent;
  let fixture: ComponentFixture<QbdDirectRegenerateQwcFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectRegenerateQwcFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectRegenerateQwcFileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
