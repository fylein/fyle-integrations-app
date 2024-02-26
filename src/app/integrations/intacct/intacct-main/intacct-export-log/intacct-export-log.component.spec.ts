import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctExportLogComponent } from './intacct-export-log.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('IntacctExportLogComponent', () => {
  let component: IntacctExportLogComponent;
  let fixture: ComponentFixture<IntacctExportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IntacctExportLogComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
