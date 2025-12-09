import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConfigurationComponent } from './sage300-configuration.component';

xdescribe('Sage300ConfigurationComponent', () => {
  let component: Sage300ConfigurationComponent;
  let fixture: ComponentFixture<Sage300ConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sage300ConfigurationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Sage300ConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
