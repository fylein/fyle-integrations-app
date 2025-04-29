import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteConnectionFormComponent } from './netsuite-connection-form.component';

describe('NetsuiteConnectionFormComponent', () => {
  let component: NetsuiteConnectionFormComponent;
  let fixture: ComponentFixture<NetsuiteConnectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetsuiteConnectionFormComponent]
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
