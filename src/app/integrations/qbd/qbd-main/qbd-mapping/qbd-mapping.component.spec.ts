import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMappingComponent } from './qbd-mapping.component';

xdescribe('QbdMappingComponent', () => {
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
