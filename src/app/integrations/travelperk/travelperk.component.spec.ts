import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelperkService } from 'src/app/core/services/travelperk/travelperk.service';
import { of, throwError } from 'rxjs';

import { TravelperkComponent } from './travelperk.component';
import { OrgService } from 'src/app/core/services/org/org.service';
import { generateTokenData } from 'src/app/core/services/org/org.fixture';
import { connectAwsS3MockData, connectTravelperkMockData, travelperkMockData } from 'src/app/core/services/travelperk/travelperk.fixture';

describe('TravelperkComponent', () => {
  let component: TravelperkComponent;
  let fixture: ComponentFixture<TravelperkComponent>;
  let orgService: OrgService;
  let travelperkService: TravelperkService;

  const service1 = {
    sanitizeUrl: () => of('dabdwba'),
    createFolder: () => of({}),
    uploadPackage: () => of({}),
    getTravelperkData: () => of(travelperkMockData),
    connectTravelperk: () => of(connectTravelperkMockData),
    connectAwsS3: () => of(connectAwsS3MockData)
  };

  const service2 = {
    createWorkatoWorkspace: () => of({}),
    connectFyle: () => of({}),
    generateToken: () => of(generateTokenData)
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelperkComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        {provide: TravelperkService, useValue: service1},
        {provide: OrgService, useValue: service2 }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelperkComponent);
    component = fixture.componentInstance;
    orgService = TestBed.inject(OrgService);
    travelperkService = TestBed.inject(TravelperkService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
