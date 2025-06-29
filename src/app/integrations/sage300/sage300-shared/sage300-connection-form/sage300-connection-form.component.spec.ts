import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConnectionFormComponent } from './sage300-connection-form.component';

describe('Sage300ConnectionFormComponent', () => {
  let component: Sage300ConnectionFormComponent;
  let fixture: ComponentFixture<Sage300ConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sage300ConnectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});