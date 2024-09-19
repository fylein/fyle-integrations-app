import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelperkConfigurationComponent } from './travelperk-configuration.component';

xdescribe('TravelperkConfigurationComponent', () => {
  let component: TravelperkConfigurationComponent;
  let fixture: ComponentFixture<TravelperkConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
