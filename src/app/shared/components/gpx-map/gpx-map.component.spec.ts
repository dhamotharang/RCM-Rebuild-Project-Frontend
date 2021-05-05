import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxMapComponent } from './gpx-map.component';
import { IonicModule } from '@ionic/angular';
import { GpxFileUploaderService } from 'src/app/core/services/gpx-file-uploader.service';
import { AuthenticationService } from 'src/app/login/services/authentication.service';
import { GpxModel } from 'src/app/core/models/gpx.model';
import { RouterTestingModule } from '@angular/router/testing';
import {ConfigurationService} from '../../../v2/core/services/configuration.service';

describe('GpxMapComponent', () => {
  let component: GpxMapComponent;
  let fixture: ComponentFixture<GpxMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, RouterTestingModule],
      declarations: [ GpxMapComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: GpxFileUploaderService,
          useValue: {}
        },
        {
          provide: AuthenticationService,
          useValue: {
            isAuthenticated: () => true,
            loggedInUser: {}
          }
        },
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxMapComponent);
    component = fixture.componentInstance;
    component.gpxModels = [
      {
        errors: []
      } as GpxModel
    ]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
