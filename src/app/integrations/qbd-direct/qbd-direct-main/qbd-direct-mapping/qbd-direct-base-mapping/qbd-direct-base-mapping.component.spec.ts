import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdDirectBaseMappingComponent } from './qbd-direct-base-mapping.component';

describe('QbdDirectBaseMappingComponent', () => {
  let component: QbdDirectBaseMappingComponent;
  let fixture: ComponentFixture<QbdDirectBaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QbdDirectBaseMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QbdDirectBaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
