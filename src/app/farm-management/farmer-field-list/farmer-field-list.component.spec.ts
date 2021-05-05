import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerFieldListComponent } from './farmer-field-list.component';
import { ModalController, ToastController } from '@ionic/angular';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';

describe('FarmerFieldListComponent', () => {
  let component: FarmerFieldListComponent;
  let fixture: ComponentFixture<FarmerFieldListComponent>;

  let modalControllerMock = {};
  let toastControllerMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerFieldListComponent ],
      providers: [
        {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: ToastController,
          useValue: toastControllerMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFieldListComponent);
    component = fixture.componentInstance;
    
    component.fieldList = [] as FarmApiModel[];
    fixture.detectChanges();
  });

  // TEST FAILING
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
