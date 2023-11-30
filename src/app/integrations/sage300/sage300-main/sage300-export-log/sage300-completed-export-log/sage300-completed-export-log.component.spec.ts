import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300CompletedExportLogComponent } from './sage300-completed-export-log.component';

describe('Sage300CompletedExportLogComponent', () => {
  let component: Sage300CompletedExportLogComponent;
  let fixture: ComponentFixture<Sage300CompletedExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300CompletedExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300CompletedExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
