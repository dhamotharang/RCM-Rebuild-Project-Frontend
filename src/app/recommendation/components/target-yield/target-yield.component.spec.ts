import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { TargetYieldComponent } from './target-yield.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('TargetYieldComponent', () => {
  let component: TargetYieldComponent;
  let fixture: ComponentFixture<TargetYieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule,
        MatDatepickerModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [TargetYieldComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
