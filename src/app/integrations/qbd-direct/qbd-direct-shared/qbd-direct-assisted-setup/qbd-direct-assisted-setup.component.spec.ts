import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QbdDirectAssistedSetupComponent } from './qbd-direct-assisted-setup.component';
import { HttpClientModule } from '@angular/common/http';

describe('QbdDirectAssistedSetupComponent', () => {
  let component: QbdDirectAssistedSetupComponent;
  let fixture: ComponentFixture<QbdDirectAssistedSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QbdDirectAssistedSetupComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QbdDirectAssistedSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});