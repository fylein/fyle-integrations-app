import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectMappingComponent } from './qbd-direct-mapping.component';

describe('QbdDirectMappingComponent', () => {
  let component: QbdDirectMappingComponent;
  let fixture: ComponentFixture<QbdDirectMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdDirectMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
