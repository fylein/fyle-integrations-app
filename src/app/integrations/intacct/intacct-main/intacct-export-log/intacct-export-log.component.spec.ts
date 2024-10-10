import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctExportLogComponent } from './intacct-export-log.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

describe('IntacctExportLogComponent', () => {
  let component: IntacctExportLogComponent;
  let fixture: ComponentFixture<IntacctExportLogComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ IntacctExportLogComponent ],
      providers: [ FormBuilder, provideRouter([]) ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    fixture = TestBed.createComponent(IntacctExportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to completed export log', () => {
    expect(component.activeModule).toEqual(component.modules[0]);
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/integrations/intacct/main/export_log/complete');
  });
});
