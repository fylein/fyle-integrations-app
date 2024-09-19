import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboBaseMappingComponent } from './qbo-base-mapping.component';

xdescribe('QboBaseMappingComponent', () => {
  let component: QboBaseMappingComponent;
  let fixture: ComponentFixture<QboBaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboBaseMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboBaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
