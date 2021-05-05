import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerFilterFeedbackComponent } from './farmer-filter-feedback.component';

describe('FarmerFilterFeedbackComponent', () => {
  let component: FarmerFilterFeedbackComponent;
  let fixture: ComponentFixture<FarmerFilterFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerFilterFeedbackComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerFilterFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
