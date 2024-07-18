import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QBDExportDateType } from 'src/app/core/models/enum/enum.model';

import { ConfigurationLabelComponent } from './configuration-label.component';

describe('ConfigurationLabelComponent', () => {
  let component: ConfigurationLabelComponent;
  let fixture: ComponentFixture<ConfigurationLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationLabelComponent);
    component = fixture.componentInstance;
    component.labelValue =
      {
        label: 'Spend Date',
        value: QBDExportDateType.SPENT_AT
      };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
