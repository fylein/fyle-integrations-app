import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectSetupConnectionComponent } from './qbd-direct-setup-connection.component';

xdescribe('QbdDirectSetupConnectionComponent', () => {
  let component: QbdDirectSetupConnectionComponent;
  let fixture: ComponentFixture<QbdDirectSetupConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectSetupConnectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdDirectSetupConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
