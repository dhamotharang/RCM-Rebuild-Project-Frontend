import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerListComponent } from './farmer-list.component';
import { ConfigurationService } from '../../../v2/core/services/configuration.service';

describe('FarmerListComponent', () => {
  let component: FarmerListComponent;
  let fixture: ComponentFixture<FarmerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
