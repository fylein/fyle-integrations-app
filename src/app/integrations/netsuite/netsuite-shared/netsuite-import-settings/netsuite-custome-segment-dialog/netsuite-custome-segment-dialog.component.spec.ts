import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetsuiteCustomeSegmentDialogComponent } from './netsuite-custome-segment-dialog.component';

describe('NetsuiteCustomeSegmentDialogComponent', () => {
  let component: NetsuiteCustomeSegmentDialogComponent;
  let fixture: ComponentFixture<NetsuiteCustomeSegmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteCustomeSegmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteCustomeSegmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
