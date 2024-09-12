import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsSpotlightComponent } from './integrations-spotlight.component';

describe('IntegrationsSpotlightComponent', () => {
  let component: IntegrationsSpotlightComponent;
  let fixture: ComponentFixture<IntegrationsSpotlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationsSpotlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegrationsSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
