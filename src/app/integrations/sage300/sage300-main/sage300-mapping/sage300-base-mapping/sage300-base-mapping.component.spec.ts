import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { Sage300BaseMappingComponent } from './sage300-base-mapping.component';

xdescribe('Sage300BaseMappingComponent', () => {
  let component: Sage300BaseMappingComponent;
  let fixture: ComponentFixture<Sage300BaseMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sage300BaseMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sage300BaseMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
