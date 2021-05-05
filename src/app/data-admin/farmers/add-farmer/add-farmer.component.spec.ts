import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFarmerComponent } from './add-farmer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FarmerService } from '../../../core/services/farmer.service';
import { AlertController } from '@ionic/angular';

describe('AddFarmerComponent', () => {
  let component: AddFarmerComponent;
  let fixture: ComponentFixture<AddFarmerComponent>;

  let farmerServiceMock = {};
  let alertControllerMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: FarmerService,
          useValue: farmerServiceMock
        },
        {
          provide: AlertController,
          useValue: alertControllerMock
        }
      ],
      declarations: [ AddFarmerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFarmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
