import { TestBed } from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';
import { of, scheduled } from 'rxjs';

import { LoaderOverlayService } from './loader-overlay.service';
import {ConfigurationService} from './configuration.service';

describe('LoaderOverlayService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigurationService,
          useValue: jasmine.createSpyObj('ConfigurationService', ['getValue'])
        }
      ],
    })
  );

  it('should be created', () => {
    const service: LoaderOverlayService = TestBed.inject(LoaderOverlayService);
    expect(service).toBeTruthy();
  });

  describe('showOverlay()', () => {
    it('should have overlayObject visible property of true', () => {
      const service: LoaderOverlayService = TestBed.inject(
        LoaderOverlayService
      );
      service.showOverlay();
      expect(service['overlayObject'].value.visible).toBeTruthy();
    });

    it('should call loader service create', () => {
      const loaderService = TestBed.inject(LoadingController);
      const loaderControllerCreateSpy = spyOn(
        loaderService,
        'create'
      ).and.callThrough();
      const service: LoaderOverlayService = TestBed.inject(
        LoaderOverlayService
      );
      service.showOverlay();
      expect(service['overlayObject'].value.visible).toBeTruthy();
      expect(loaderControllerCreateSpy).toHaveBeenCalledTimes(1);
    });

    it(`should have overlayObject loaderMessage property of falsy`, () => {
      const service: LoaderOverlayService = TestBed.inject(
        LoaderOverlayService
      );
      service.showOverlay();
      expect(service['overlayObject'].value.loaderMessage).toBeFalsy();
    });
  });

  describe(`showOverlay('custom message')`, () => {
    it(`should have overlayObject loaderMessage property of 'custom message'`, () => {
      const service: LoaderOverlayService = TestBed.inject(
        LoaderOverlayService
      );
      service.showOverlay('custom message');
      expect(service['overlayObject'].value.loaderMessage).toEqual(
        'custom message'
      );
    });
  });

  describe('hideOverlay()', () => {
    it('should have overlayObject visible property of false', () => {
      const service: LoaderOverlayService = TestBed.inject(
        LoaderOverlayService
      );
      service.hideOverlay();
      expect(service['overlayObject'].value.visible).toBeFalsy();
    });
  });
});
