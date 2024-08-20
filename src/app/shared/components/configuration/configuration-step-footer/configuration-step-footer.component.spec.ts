import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationStepFooterComponent } from './configuration-step-footer.component';

xdescribe('ConfigurationStepFooterComponent', () => {
  let component: ConfigurationStepFooterComponent;
  let fixture: ComponentFixture<ConfigurationStepFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationStepFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationStepFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.showBackButton = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save eventemit @output check', () => {
    spyOn(component.save, 'emit'); // 1
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.save.emit).toHaveBeenCalled();
  });

  it('navigate eventemit @output check', () => {
    component.showBackButton = true;
    spyOn(component.navigateToPreviousStep, 'emit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.back-btn');
    button.click();
    expect(component.navigateToPreviousStep.emit).toHaveBeenCalled();
  });
});
