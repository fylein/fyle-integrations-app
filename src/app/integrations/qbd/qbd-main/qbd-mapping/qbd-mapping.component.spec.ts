import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QbdMappingComponent } from './qbd-mapping.component';

describe('QbdMappingComponent', () => {
  let component: QbdMappingComponent;
  let fixture: ComponentFixture<QbdMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
