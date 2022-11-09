import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WindowService } from 'src/app/core/services/core/window.service';

import { RedirectComponent } from './redirect.component';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;

  const service1 = {
    redirect: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectComponent ],
      providers: [
        { provide: WindowService, useValue: service1 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
