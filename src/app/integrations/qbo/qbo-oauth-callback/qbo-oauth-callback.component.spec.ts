import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboOauthCallbackComponent } from './qbo-oauth-callback.component';

describe('QboOauthCallbackComponent', () => {
  let component: QboOauthCallbackComponent;
  let fixture: ComponentFixture<QboOauthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboOauthCallbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboOauthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
