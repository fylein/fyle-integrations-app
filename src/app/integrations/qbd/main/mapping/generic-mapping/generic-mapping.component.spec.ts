import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMappingComponent } from './generic-mapping.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IntegrationsToastService } from 'src/app/core/services/core/integrations-toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'primeng/api';
import { QbdMappingService } from 'src/app/core/services/qbd/qbd-mapping/qbd-mapping.service';

describe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;

  let activatedRoute: ActivatedRoute;
  let service4;

  beforeEach(async () => {
    service4 = {
      displayToastMessage: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule, NoopAnimationsModule],
      declarations: [ GenericMappingComponent],
      providers: [QbdMappingService,
        {provide: IntegrationsToastService, useValue: service4}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
