import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectConfigurationComponent } from './qbd-direct-configuration.component';

describe('QbdDirectConfigurationComponent', () => {
  let component: QbdDirectConfigurationComponent;
  let fixture: ComponentFixture<QbdDirectConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdDirectConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
