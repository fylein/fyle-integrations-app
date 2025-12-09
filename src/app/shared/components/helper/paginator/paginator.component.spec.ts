import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';

xdescribe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    component.dropDownValue = 10;
    component.totalCount = 20;
    component.page = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pageSizeChanges function change', () => {
    spyOn(component.pageSizeChangeEvent, 'emit');
    expect(component.pageSizeChanges({ value: 10 })).toBeUndefined();
    expect(component.pageSizeChangeEvent.emit).toHaveBeenCalled();
  });

  it('previousPageChange function change', () => {
    spyOn(component.pageOffsetChangeEvent, 'emit');
    expect(component.previousPageChange(2)).toBeUndefined();
    expect(component.pageOffsetChangeEvent.emit).toHaveBeenCalled();
  });

  it('nextPageChange function change', () => {
    spyOn(component.pageOffsetChangeEvent, 'emit');
    expect(component.nextPageChange(1)).toBeUndefined();
    expect(component.pageOffsetChangeEvent.emit).toHaveBeenCalled();
  });

  it('navigateToPage function check', () => {
    spyOn(component.pageOffsetChangeEvent, 'emit');
    expect(component.navigateToPage(1)).toBeUndefined();
    expect(component.page).toBe(1);
    expect(component.pageOffsetChangeEvent.emit).toHaveBeenCalled();
    expect(component.navigateToPage(2)).toBeUndefined();
    expect(component.page).toBe(2);
    expect(component.pageOffsetChangeEvent.emit).toHaveBeenCalled();
  });
});
