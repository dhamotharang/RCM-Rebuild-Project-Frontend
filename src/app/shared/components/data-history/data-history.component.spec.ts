import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistoryComponent } from './data-history.component';

describe('DataHistoryComponent', () => {
  let component: DataHistoryComponent;
  let fixture: ComponentFixture<DataHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataHistoryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  describe('Provide empty dataHistory array', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DataHistoryComponent);
      component = fixture.componentInstance;
      component.dataHistories = [];
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  })
});
