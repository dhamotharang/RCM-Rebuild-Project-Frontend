import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OfflineStorageService } from 'src/app/offline-management/services/offline-storage.service';
import { FarmerService } from '../services/farmer.service';

import { AddFarmerComponent } from './add-farmer.component';

describe('AddFarmerComponent', () => {
  let component: AddFarmerComponent;
  let fixture: ComponentFixture<AddFarmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFarmerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: FarmerService,
          useValue: {}
        },
        {
          provide: OfflineStorageService,
          useValue: {}
        }
      ]
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
