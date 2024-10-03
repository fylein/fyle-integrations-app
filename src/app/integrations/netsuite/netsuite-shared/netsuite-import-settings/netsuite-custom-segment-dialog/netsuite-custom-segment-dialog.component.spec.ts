import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetsuiteCustomSegmentDialogComponent } from './netsuite-custom-segment-dialog.component';

xdescribe('NetsuiteCustomSegmentDialogComponent', () => {
  let component: NetsuiteCustomSegmentDialogComponent;
  let fixture: ComponentFixture<NetsuiteCustomSegmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteCustomSegmentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteCustomSegmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
