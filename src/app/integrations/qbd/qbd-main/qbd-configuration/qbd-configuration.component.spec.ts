import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdConfigurationComponent } from './qbd-configuration.component';

xdescribe('QbdConfigurationComponent', () => {
  let component: QbdConfigurationComponent;
  let fixture: ComponentFixture<QbdConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
