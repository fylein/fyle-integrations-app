import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QbdDirectPrerequisitesV2Component } from './qbd-direct-prerequisites-v2.component';

describe('QbdDirectPrerequisitesV2Component', () => {
  let component: QbdDirectPrerequisitesV2Component;
  let fixture: ComponentFixture<QbdDirectPrerequisitesV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectPrerequisitesV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectPrerequisitesV2Component);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
