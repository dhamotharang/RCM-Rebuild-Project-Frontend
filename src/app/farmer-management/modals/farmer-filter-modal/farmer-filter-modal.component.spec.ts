import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { BrowserUrlService } from 'src/app/v2/core/services/browser-url.service';
import { Storage } from '@ionic/storage';
import { FarmerFilterModalComponent } from './farmer-filter-modal.component';

describe('FarmerFilterModalComponent', () => {
  let storageServiceMock = {};
  let component: FarmerFilterModalComponent;
  let fixture: ComponentFixture<FarmerFilterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FarmerFilterModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: {},
        },
        {
          provide: BrowserUrlService,
          useValue: {
            upsertQueryParam: (key: string, value: string) => {
              return;
            }
          }
        },
        {
          provide: Storage,
          useValue: storageServiceMock
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFilterModalComponent);
    component = fixture.componentInstance;
    component.farmerFilter = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
