import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteSharedComponent } from './netsuite-shared.component';

xdescribe('NetsuiteSharedComponent', () => {
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
