import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldModalComponent } from './field-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { FarmApiModel } from 'src/app/farm-management/models/api/farm-api.model';
import { FieldService } from 'src/app/farm-management/services/field.service';

describe('FieldModalComponent', () => {
  let component: FieldModalComponent;
  let fixture: ComponentFixture<FieldModalComponent>;

  let dataServiceMock = {
    getFields: (farmerId: number) => {
      let fields = [] as FarmApiModel[];
      return of(fields);
    }
  };
  let modalControllerMock = {};
  let toastControllerMock = {
    
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: FieldService,
          useValue: dataServiceMock
        }, {
          provide: ModalController,
          useValue: modalControllerMock
        }, {
          provide: ToastController,
          useValue: toastControllerMock
        }
      ],
      declarations: [ FieldModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
