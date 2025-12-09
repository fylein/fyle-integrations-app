import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroStateWithIllustrationComponent } from './zero-state-with-illustration.component';

xdescribe('ZeroStateWithIllustrationComponent', () => {
  let component: ZeroStateWithIllustrationComponent;
  let fixture: ComponentFixture<ZeroStateWithIllustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZeroStateWithIllustrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZeroStateWithIllustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
