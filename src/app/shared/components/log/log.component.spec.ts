import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogComponent } from './log.component';
import { LogService } from 'src/app/v2/core/services/log.service';
import { of } from 'rxjs';
import { LogModel } from 'src/app/v2/core/models/log.model';

describe('LogComponent', () => {
  let component: LogComponent;
  let fixture: ComponentFixture<LogComponent>;

  let logServiceMock = {
    getLogs: () => {
      return of([] as LogModel[]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LogService,
          useValue: logServiceMock
        }
      ],
      declarations: [ LogComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
