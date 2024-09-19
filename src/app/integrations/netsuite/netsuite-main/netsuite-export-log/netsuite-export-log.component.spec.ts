import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NetsuiteExportLogComponent } from './netsuite-export-log.component';

xdescribe('NetsuiteExportLogComponent', () => {
  let component: NetsuiteExportLogComponent;
  let fixture: ComponentFixture<NetsuiteExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetsuiteExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetsuiteExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
