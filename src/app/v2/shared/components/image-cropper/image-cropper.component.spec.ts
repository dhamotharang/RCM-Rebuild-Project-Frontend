import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperComponent } from './image-cropper.component';
import { IonicModule } from '@ionic/angular';

describe('ImageCropperComponent', () => {
  let component: ImageCropperComponent;
  let fixture: ComponentFixture<ImageCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule],
      declarations: [ ImageCropperComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
