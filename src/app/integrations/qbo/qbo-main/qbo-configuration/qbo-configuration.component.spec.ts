import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboConfigurationComponent } from './qbo-configuration.component';

xdescribe('QboConfigurationComponent', () => {
  let component: QboConfigurationComponent;
  let fixture: ComponentFixture<QboConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QboConfigurationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QboConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
