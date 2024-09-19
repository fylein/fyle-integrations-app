import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { XeroMainComponent } from './xero-main.component';

xdescribe('XeroMainComponent', () => {
  let component: XeroMainComponent;
  let fixture: ComponentFixture<XeroMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeroMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XeroMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
