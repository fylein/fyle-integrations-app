import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteConnectorComponent } from './netsuite-connector.component';

xdescribe('NetsuiteConnectorComponent', () => {
  let component: NetsuiteConnectorComponent;
  let fixture: ComponentFixture<NetsuiteConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetsuiteConnectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetsuiteConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
