import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteConnectionFormComponent } from './netsuite-connection-form.component';

xdescribe('NetsuiteConnectionFormComponent', () => {
  let component: NetsuiteConnectionFormComponent;
  let fixture: ComponentFixture<NetsuiteConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteConnectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
