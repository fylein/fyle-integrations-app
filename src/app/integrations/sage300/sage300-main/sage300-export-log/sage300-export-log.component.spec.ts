import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300ExportLogComponent } from './sage300-export-log.component';

xdescribe('Sage300ExportLogComponent', () => {
  let component: Sage300ExportLogComponent;
  let fixture: ComponentFixture<Sage300ExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300ExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
