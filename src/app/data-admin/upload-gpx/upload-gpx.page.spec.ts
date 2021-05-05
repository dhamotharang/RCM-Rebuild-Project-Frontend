import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGpxPage } from './upload-gpx.page';
import { GpxFileUploaderService } from '../../core/services/gpx-file-uploader.service';
import { RouterTestingModule } from '@angular/router/testing';

// describe('UploadGpxPage', () => {
  // let component: UploadGpxPage;
  // let fixture: ComponentFixture<UploadGpxPage>;

  // let gpxUploadService = {};

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [RouterTestingModule],
  //     providers: [
  //       {
  //         provide: GpxFileUploaderService,
  //         useValue: gpxUploadService
  //       }
  //     ],
  //     declarations: [ UploadGpxPage ],
  //     schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //   })
  //   .compileComponents();
  // }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(UploadGpxPage);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
// });
