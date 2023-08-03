import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntacctConnectorComponent } from './intacct-connector.component';

describe('IntacctConnectorComponent', () => {
  let component: IntacctConnectorComponent;
  let fixture: ComponentFixture<IntacctConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntacctConnectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntacctConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
