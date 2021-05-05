import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SplittingFertilizerResourcesComponent } from './splitting-fertilizer-resources.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('SplittingFertilizerResourcesComponent', () => {
  let component: SplittingFertilizerResourcesComponent;
  let fixture: ComponentFixture<SplittingFertilizerResourcesComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SplittingFertilizerResourcesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        IonicModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplittingFertilizerResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
