import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectMainComponent } from './qbd-direct-main.component';

xdescribe('QbdDirectMainComponent', () => {
  let component: QbdDirectMainComponent;
  let fixture: ComponentFixture<QbdDirectMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
