import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepHeaderComponent } from './configuration-step-header.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigurationStepHeaderComponent', () => {
  let component: ConfigurationStepHeaderComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ConfigurationStepHeaderComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationStepHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
