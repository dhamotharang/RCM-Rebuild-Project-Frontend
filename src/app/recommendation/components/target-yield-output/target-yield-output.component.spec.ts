import { CustomDialectTranslationPipe } from 'src/app/recommendation/pipe/custom-dialect-translation.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RoundUpPipe } from 'src/app/recommendation/pipe/round-up.pipe';

import { TargetYieldOutputComponent } from './target-yield-output.component';

describe('TargetYieldOutputComponent', () => {
  let component: TargetYieldOutputComponent;
  let fixture: ComponentFixture<TargetYieldOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetYieldOutputComponent, RoundUpPipe, CustomDialectTranslationPipe ],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetYieldOutputComponent);
    component = fixture.componentInstance;
    component.dialectSelected = 'english';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
