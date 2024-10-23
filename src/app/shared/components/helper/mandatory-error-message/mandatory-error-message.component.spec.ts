import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MandatoryErrorMessageComponent } from './mandatory-error-message.component';

xdescribe('MandatoryErrorMessageComponent', () => {
  let component: MandatoryErrorMessageComponent;
  let fixture: ComponentFixture<MandatoryErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatoryErrorMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MandatoryErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listName input with a consonent check', () => {
    component.listName = 'Fyle';
    component.ngOnInit();
    expect(component.listName).toEqual('a Fyle');
    fixture.detectChanges();
    const listNamespan = fixture.debugElement.queryAll(By.css('span'));
    const listNamespanText = listNamespan[0].nativeElement.innerHTML;
    expect(listNamespanText).toEqual(`Please select ${component.listName} from the list`);
  });

  it('listName input with a consonent check', () => {
    component.listName = 'how fyle';
    component.ngOnInit();
    expect(component.listName).toEqual('how fyle');
    fixture.detectChanges();
    const listNamespan = fixture.debugElement.queryAll(By.css('span'));
    const listNamespanText = listNamespan[0].nativeElement.innerHTML;
    expect(listNamespanText).toEqual(`Please select ${component.listName} from the list`);
  });

  it('listName input with a vowel check', () => {
    component.listName = 'Apple';
    component.ngOnInit();
    expect(component.listName).toEqual('an Apple');
    fixture.detectChanges();
    const listNamespan = fixture.debugElement.queryAll(By.css('span'));
    const listNamespanText = listNamespan[0].nativeElement.innerHTML;
    expect(listNamespanText).toEqual(`Please select ${component.listName} from the list`);
  });

  it('customErrorMessage input check', () => {
    component.customErrorMessage = 'Fyle requires a meaningfull word';
    fixture.detectChanges();
    const listNamespan = fixture.debugElement.queryAll(By.css('span'));
    const listNamespanText = listNamespan[0].nativeElement.innerHTML;
    expect(listNamespanText).toEqual(component.customErrorMessage);
  });

});
