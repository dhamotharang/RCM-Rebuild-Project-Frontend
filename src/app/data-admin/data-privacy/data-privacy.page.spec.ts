import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPrivacyPage } from './data-privacy.page';
import { DataPrivacyService } from 'src/app/v2/core/services/data-privacy.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DataPrivacyPage', () => {
  let component: DataPrivacyPage;
  let fixture: ComponentFixture<DataPrivacyPage>;

  let dataPrivacyServiceStub: any = {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ DataPrivacyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DataPrivacyService,
          useValue: dataPrivacyServiceStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPrivacyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
