import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkComponent } from './travelperk.component';

describe('TravelperkComponent', () => {
  let component: TravelperkComponent;
  let fixture: ComponentFixture<TravelperkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
