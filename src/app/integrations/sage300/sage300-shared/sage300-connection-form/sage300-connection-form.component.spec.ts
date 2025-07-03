import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sage300ConnectionFormComponent } from './sage300-connection-form.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';


describe('Sage300ConnectionFormComponent', () => {
  let component: Sage300ConnectionFormComponent;
  let fixture: ComponentFixture<Sage300ConnectionFormComponent>;

  beforeEach(async () => {
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate'], {
      config: {
        reRenderOnLangChange: true
      },
      langChanges$: of('en'),
      _loadDependencies: () => Promise.resolve()
    });

    await TestBed.configureTestingModule({
      declarations: [Sage300ConnectionFormComponent],
      imports: [ TranslocoModule],
      providers: [{ provide: TranslocoService, useValue: translocoServiceSpy }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300ConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});