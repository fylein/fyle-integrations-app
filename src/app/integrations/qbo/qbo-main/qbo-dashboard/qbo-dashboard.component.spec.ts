import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboDashboardComponent } from './qbo-dashboard.component';

xdescribe('QboDashboardComponent', () => {
  let component: QboDashboardComponent;
  let fixture: ComponentFixture<QboDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
