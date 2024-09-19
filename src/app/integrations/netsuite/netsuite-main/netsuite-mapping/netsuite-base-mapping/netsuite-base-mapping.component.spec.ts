import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteBaseMappingComponent } from './netsuite-base-mapping.component';

xdescribe('NetsuiteBaseMappingComponent', () => {
  let component: NetsuiteBaseMappingComponent;
  let fixture: ComponentFixture<NetsuiteBaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteBaseMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteBaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
