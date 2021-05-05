import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhLocationFormComponent } from './ph-location-form.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PhLocationFormComponent', () => {
  let component: PhLocationFormComponent;
  let fixture: ComponentFixture<PhLocationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatSelectModule, NoopAnimationsModule],
      declarations: [ PhLocationFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  describe('when creating default instance', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PhLocationFormComponent);
      component = fixture.componentInstance;
      component.formGroup = new FormGroup({});
      component.locationFormModel = {}
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  })

  describe('when disabled Input is true', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PhLocationFormComponent);
      component = fixture.componentInstance;
      component.formGroup = new FormGroup({});
      component.disabled = true;
      component.locationFormModel = {}
      fixture.detectChanges();
    });
  
    it('region control should be disabled', () => {
      expect(component.regionControl.disabled).toBeTruthy();
    });

    it('province control should be disabled', () => {
      expect(component.provinceControl.disabled).toBeTruthy();
    });

    it('municipality control should be disabled', () => {
      expect(component.municipalityControl.disabled).toBeTruthy();
    });

    it('barangay control should be disabled', () => {
      expect(component.barangayControl.disabled).toBeTruthy();
    });
  });
});
