import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectDataSyncComponent } from './qbd-direct-data-sync.component';

xdescribe('QbdDirectDataSyncComponent', () => {
  let component: QbdDirectDataSyncComponent;
  let fixture: ComponentFixture<QbdDirectDataSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectDataSyncComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdDirectDataSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
