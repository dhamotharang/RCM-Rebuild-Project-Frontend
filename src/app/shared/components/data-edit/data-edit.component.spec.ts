import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEditComponent } from './data-edit.component';

describe('DataEditComponent', () => {
  let component: DataEditComponent;
  let fixture: ComponentFixture<DataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEditComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
