import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipExportLogComponent } from './skip-export-log.component';

describe('SkipExportLogComponent', () => {
  let component: SkipExportLogComponent;
  let fixture: ComponentFixture<SkipExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkipExportLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkipExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
