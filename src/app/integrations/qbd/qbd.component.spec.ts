import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdComponent } from './qbd.component';

describe('QbdComponent', () => {
  let component: QbdComponent;
  let fixture: ComponentFixture<QbdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QbdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
