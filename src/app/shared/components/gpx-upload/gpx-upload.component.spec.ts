import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpxUploadComponent } from './gpx-upload.component';
import { GpxFileUploaderService } from 'src/app/core/services/gpx-file-uploader.service';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

describe('GpxUploadComponent', () => {
  let component: GpxUploadComponent;
  let fixture: ComponentFixture<GpxUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, IonicModule],
      declarations: [ GpxUploadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: GpxFileUploaderService,
          useValue: { }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpxUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
