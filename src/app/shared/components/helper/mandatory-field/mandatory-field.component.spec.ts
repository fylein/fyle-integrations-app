import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MandatoryFieldComponent } from './mandatory-field.component';

describe('MandatoryFieldComponent', () => {
  let component: MandatoryFieldComponent;
  let fixture: ComponentFixture<MandatoryFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatoryFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatoryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Mandatory field check', () => {
    const mandatorySpan: HTMLElement = fixture.debugElement.query(By.css(".tw-text-mandatory-field-color")).nativeElement;
    expect(getComputedStyle(mandatorySpan).color).toEqual('rgb(255, 51, 102)');
    const mandatorySpanText = mandatorySpan.innerHTML;
    expect(mandatorySpanText).toEqual('*');
  });
});
