import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { DownloadFarmerListModalComponent } from './download-farmer-list-modal.component';

describe('DownloadFarmerListModalComponent', () => {
  let component: DownloadFarmerListModalComponent;
  let fixture: ComponentFixture<DownloadFarmerListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadFarmerListModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFarmerListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
