import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctConnectionFormComponent } from './intacct-connection-form.component';

describe('IntacctConnectionFormComponent', () => {
  let component: IntacctConnectionFormComponent;
  let fixture: ComponentFixture<IntacctConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntacctConnectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});