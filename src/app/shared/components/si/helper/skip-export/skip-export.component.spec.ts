import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipExportComponent } from './skip-export.component';

describe('SkipExportComponent', () => {
  let component: SkipExportComponent;
  let fixture: ComponentFixture<SkipExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkipExportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkipExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
