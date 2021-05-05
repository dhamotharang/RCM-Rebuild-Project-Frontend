import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerDataPrivacyComponent } from './farmer-data-privacy.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { DataPrivacyService } from 'src/app/v2/core/services/data-privacy.service';

describe('DataPrivacyComponent', () => {
  let component: FarmerDataPrivacyComponent;
  let fixture: ComponentFixture<FarmerDataPrivacyComponent>;

  let modalControllerMock = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ModalController,
          useValue: modalControllerMock
        },
        {
          provide: DataPrivacyService,
          useValue: {}
        }
      ],
      declarations: [ FarmerDataPrivacyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerDataPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
