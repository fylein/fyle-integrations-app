import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BambooHrComponent } from './bamboo-hr.component';

describe('BambooHrComponent', () => {
  let component: BambooHrComponent;
  let fixture: ComponentFixture<BambooHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BambooHrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BambooHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
