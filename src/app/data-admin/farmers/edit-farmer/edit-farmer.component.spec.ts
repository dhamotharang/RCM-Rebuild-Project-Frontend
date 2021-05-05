import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFarmerComponent } from './edit-farmer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController } from '@ionic/angular';
import { FarmerService } from '../../../core/services/farmer.service';
import { of } from 'rxjs';
import { FarmerApiModel } from 'src/app/farmer-management/models/api/farmer-api.model';

describe('EditFarmerComponent', () => {
  let component: EditFarmerComponent;
  let fixture: ComponentFixture<EditFarmerComponent>;

  let alertControllerMock = {};
  let farmerServiceMock = {
    getFarmerInfo: (farmerId: string) => {
      let ret = {} as FarmerApiModel;
      return of(ret);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: AlertController,
          useValue: alertControllerMock
        }, {
          provide: FarmerService,
          useValue: farmerServiceMock
        }
      ],
      declarations: [ EditFarmerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
