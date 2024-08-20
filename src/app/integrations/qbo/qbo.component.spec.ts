import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboComponent } from './qbo.component';

xdescribe('QboComponent', () => {
  let component: QboComponent;
  let fixture: ComponentFixture<QboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
