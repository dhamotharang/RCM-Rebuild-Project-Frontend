import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { OfflineFarmerListModalComponent } from './offline-farmer-list-modal.component';

describe('OfflineFarmerListModalComponent', () => {
  let component: OfflineFarmerListModalComponent;
  let fixture: ComponentFixture<OfflineFarmerListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineFarmerListModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: {},
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineFarmerListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
