import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipExportComponent } from './skip-export.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('SkipExportComponent', () => {
  let component: SkipExportComponent;
  let fixture: ComponentFixture<SkipExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SkipExportComponent],
    imports: [],
    providers: [FormBuilder, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(SkipExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
