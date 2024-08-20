import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroStateComponent } from './zero-state.component';

xdescribe('ZeroStateComponent', () => {
  let component: ZeroStateComponent;
  let fixture: ComponentFixture<ZeroStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
