import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerManagementPage } from './farmer-management.page';
import { Storage } from '@ionic/storage';

describe('FarmerManagementPage', () => {
  let storageServiceMock = {};
  let component: FarmerManagementPage;
  let fixture: ComponentFixture<FarmerManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerManagementPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Storage,
          useValue: storageServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
