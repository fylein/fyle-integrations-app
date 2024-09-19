import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroComponent } from './xero.component';

xdescribe('XeroComponent', () => {
  let component: XeroComponent;
  let fixture: ComponentFixture<XeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
