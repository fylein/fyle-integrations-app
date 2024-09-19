import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { QboMainComponent } from './qbo-main.component';

xdescribe('QboMainComponent', () => {
  let component: QboMainComponent;
  let fixture: ComponentFixture<QboMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
