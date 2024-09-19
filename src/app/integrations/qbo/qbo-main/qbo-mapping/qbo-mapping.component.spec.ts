import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboMappingComponent } from './qbo-mapping.component';

xdescribe('QboMappingComponent', () => {
  let component: QboMappingComponent;
  let fixture: ComponentFixture<QboMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
