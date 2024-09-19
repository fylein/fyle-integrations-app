import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { OauthTravelperkComponent } from './oauth-travelperk.component';

xdescribe('TravelperkComponent', () => {
  let component: OauthTravelperkComponent;
  let fixture: ComponentFixture<OauthTravelperkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OauthTravelperkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OauthTravelperkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
