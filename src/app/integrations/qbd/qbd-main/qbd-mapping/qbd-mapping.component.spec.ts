import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbdMappingComponent } from './qbd-mapping.component';
import { TranslocoService } from '@jsverse/transloco';

describe('QbdMappingComponent', () => {
  let component: QbdMappingComponent;
  let fixture: ComponentFixture<QbdMappingComponent>;
  let translocoService: any;

  beforeEach(async () => {
    translocoService = jasmine.createSpyObj('TranslocoService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [QbdMappingComponent],
      providers: [{ provide: TranslocoService, useValue: translocoService }],
    }).compileComponents();

    fixture = TestBed.createComponent(QbdMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
