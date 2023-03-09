import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GustoComponent } from './gusto.component';

describe('GustoComponent', () => {
  let component: GustoComponent;
  let fixture: ComponentFixture<GustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GustoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
