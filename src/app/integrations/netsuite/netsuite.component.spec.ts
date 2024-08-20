import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteComponent } from './netsuite.component';

xdescribe('NetsuiteComponent', () => {
  let component: NetsuiteComponent;
  let fixture: ComponentFixture<NetsuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
