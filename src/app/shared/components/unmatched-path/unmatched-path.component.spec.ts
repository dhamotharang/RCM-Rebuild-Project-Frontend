import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmatchedPathComponent } from './unmatched-path.component';

describe('UnmatchedPathComponent', () => {
  let component: UnmatchedPathComponent;
  let fixture: ComponentFixture<UnmatchedPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmatchedPathComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmatchedPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
