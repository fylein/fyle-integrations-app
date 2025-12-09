import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthDefaultComponent } from './oauth-default.component';

xdescribe('OauthDefaultComponent', () => {
  let component: OauthDefaultComponent;
  let fixture: ComponentFixture<OauthDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OauthDefaultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
