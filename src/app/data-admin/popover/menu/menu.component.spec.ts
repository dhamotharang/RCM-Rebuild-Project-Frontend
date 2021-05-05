import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PopoverController } from '@ionic/angular';
import { Role } from 'src/app/v2/core/enums/role.enum';
import { AuthenticationService } from 'src/app/login/services/authentication.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    let popoverStub = {};
    let authServiceHub = {
      userInfo: {
        government_agency_office: Role.DATA_ADMIN
      }
    }
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: PopoverController,
          useValue: popoverStub
        },
        {
          provide: AuthenticationService,
          useValue: authServiceHub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
