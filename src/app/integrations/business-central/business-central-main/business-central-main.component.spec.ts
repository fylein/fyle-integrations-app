import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCentralMainComponent } from './business-central-main.component';

xdescribe('BusinessCentralMainComponent', () => {
  let component: BusinessCentralMainComponent;
  let fixture: ComponentFixture<BusinessCentralMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessCentralMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessCentralMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
