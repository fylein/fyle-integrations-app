import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginatorComponent ]
    })
    .compileComponents();

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

  it('offsetChanges function change', () => {
    spyOn(component.offsetChangeEvent, 'emit');
    expect(component.offsetChanges({value: 10})).toBeUndefined();
    expect(component.offsetChangeEvent.emit).toHaveBeenCalled();
  });

  it('previousPageChange function change', () => {
    spyOn(component.pageChangeEvent, 'emit');
    expect(component.previousPageChange(2)).toBeUndefined();
    expect(component.pageChangeEvent.emit).toHaveBeenCalled();
  });

  it('nextPageChange function change', () => {
    spyOn(component.pageChangeEvent, 'emit');
    expect(component.nextPageChange(1)).toBeUndefined();
    expect(component.pageChangeEvent.emit).toHaveBeenCalled();
  });
});
