import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxInfoComponent } from './gpx-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('GpxInfoComponent', () => {
  let component: GpxInfoComponent;
  let fixture: ComponentFixture<GpxInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ GpxInfoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{
        provide: Router,
        useValue: {
          getCurrentNavigation: () => {
            return {
              extras: {
                state: undefined
              }
            }
          }
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TO FIX: Failing Test
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
