import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300MainComponent } from './sage300-main.component';

xdescribe('Sage300MainComponent', () => {
  let component: Sage300MainComponent;
  let fixture: ComponentFixture<Sage300MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sage300MainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Sage300MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
