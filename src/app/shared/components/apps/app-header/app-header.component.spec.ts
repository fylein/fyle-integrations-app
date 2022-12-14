import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHeaderComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sync employees', () => {
    spyOn(component.syncEmployees, 'emit');

    component.syncData();
    expect(component.syncEmployees.emit).toHaveBeenCalled();
  });

  it('should open Bamboo HR connection', () => {
    spyOn(component.openDialog, 'emit');

    component.connectBambooHR();
    expect(component.openDialog.emit).toHaveBeenCalled();
  });

  it('should disconnect Bamboo HR connection', () => {
    spyOn(component.disconnectBambooHr, 'emit');

    component.disconnect();
    expect(component.disconnectBambooHr.emit).toHaveBeenCalled();
  });
});
