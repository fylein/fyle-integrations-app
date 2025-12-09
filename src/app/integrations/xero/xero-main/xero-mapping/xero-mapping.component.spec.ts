import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeroMappingComponent } from './xero-mapping.component';

xdescribe('XeroMappingComponent', () => {
  let component: XeroMappingComponent;
  let fixture: ComponentFixture<XeroMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XeroMappingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XeroMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
