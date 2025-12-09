import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteMainComponent } from './netsuite-main.component';

xdescribe('NetsuiteMainComponent', () => {
  let component: NetsuiteMainComponent;
  let fixture: ComponentFixture<NetsuiteMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteMainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
