import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteSharedComponent } from './netsuite-shared.component';

describe('NetsuiteSharedComponent', () => {
  let component: NetsuiteSharedComponent;
  let fixture: ComponentFixture<NetsuiteSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteSharedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
