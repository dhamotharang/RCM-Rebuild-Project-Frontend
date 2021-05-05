import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';
import { LocationInterceptorHttpMock } from './testing/location-http.mock';
import {
  DEFAULT_BARANGAY_ID,
  DEFAULT_BARANGAY_LABEL,
  DEFAULT_MUNICIPALITY_ID,
  DEFAULT_MUNICIPALITY_LABEL,
  DEFAULT_PROVINCE_ID,
  DEFAULT_PROVINCE_LABEL,
  DEFAULT_REGION_ID,
  DEFAULT_REGION_LABEL,
} from './testing/values.mock';

describe('LocationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LocationInterceptorHttpMock,
          multi: true,
        },
      ],
    })
  );

  it('should be created', () => {
    const service: LocationService = TestBed.inject(LocationService);
    expect(service).toBeTruthy();
  });

  describe('getRegions()', () => {
    it('should return at least 1 region', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const regions = await service.getRegionsApi().toPromise();
      expect(regions).toBeTruthy();
      expect(regions.length > 0).toBeTruthy();
    }));

    it('every id should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const regions = await service.getRegionsApi().toPromise();
      expect(regions.every((region) => region.id > 0)).toBeTruthy();
    }));

    it('every label should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const regions = await service.getRegionsApi().toPromise();
      expect(regions.every((region) => region.label)).toBeTruthy();
    }));

    it('should cache result', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      await service.getRegionsApi().toPromise();
      expect(service['regionData'].length > 0).toBeTruthy();
    }));

    it('should map correct property values', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const regions = await service.getRegionsApi().toPromise();
      const expectedRegion = regions.find(
        (region) => region.id === DEFAULT_REGION_ID
      );
      expect(expectedRegion).toBeTruthy();
      expect(expectedRegion.label).toEqual(DEFAULT_REGION_LABEL);
    }));

    describe('called multiple times', () => {
      it('should call http service exactly 1 time only', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const httpClient = TestBed.inject(HttpClient);
        const httpClientGetSpy = spyOn(httpClient, 'get').and.callThrough();
        await service.getRegionsApi().toPromise();
        await service.getRegionsApi().toPromise();

        expect(httpClientGetSpy).toHaveBeenCalledTimes(1);
      }));

      it('all results should not be empty', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const regionResult1 = await service.getRegionsApi().toPromise();
        const regionResult2 = await service.getRegionsApi().toPromise();

        expect(regionResult1.length > 0).toBeTruthy();
        expect(regionResult2.length > 0).toBeTruthy();
      }));
    });
  });

  describe('getProvinces()', () => {
    it('should return at least 1 province/s', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const provinces = await service.getProvinces().toPromise();
      expect(provinces).toBeTruthy();
      expect(provinces.length > 0).toBeTruthy();
    }));

    it('every id should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const provinces = await service.getProvinces().toPromise();
      expect(provinces.every((province) => province.id > 0)).toBeTruthy();
    }));

    it('every label should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const provinces = await service.getProvinces().toPromise();
      expect(provinces.every((province) => province.label)).toBeTruthy();
    }))
    
    it('should cache result', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      await service.getProvinces().toPromise();
      expect(service['provinceData'].length > 0).toBeTruthy();
    }));

    it('should map correct property values', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const provinces = await service.getProvinces().toPromise();
      const expectedProvince = provinces.find(
        (province) => province.id === DEFAULT_PROVINCE_ID
      );
      expect(expectedProvince).toBeTruthy();
      expect(expectedProvince.label).toEqual(DEFAULT_PROVINCE_LABEL);
    }));
  });

  describe('getRegionProvinces()', () => {
        
    it('result should have same regionId', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const regionProvinces = await service.getRegionProvinces(DEFAULT_REGION_ID).toPromise();
      const expectedProvinceResult = regionProvinces.filter(province => province.regionId === DEFAULT_REGION_ID);
      expect(regionProvinces.length).toBeTruthy(expectedProvinceResult.length);
    }));
  })

  describe('getProvinceMunicipalities()', () => {
        
    it('result should have same provinceId', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const provinceMunicipalities = await service.getProvinceMunicipalities(DEFAULT_MUNICIPALITY_ID).toPromise();
      const expectedMunitipalityResult = provinceMunicipalities.filter(municipality => municipality.provinceId === DEFAULT_PROVINCE_ID);
      expect(provinceMunicipalities.length).toBeTruthy(expectedMunitipalityResult.length);
    }));
  })

  describe('getMunicipalities()', () => {
    it('should return at least 1 municipality/s', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const municipalities = await service.getMunicipalities().toPromise();
      expect(municipalities).toBeTruthy();
      expect(municipalities.length > 0).toBeTruthy();
    }));

    it('every id should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const municipalities = await service.getMunicipalities().toPromise();
      expect(
        municipalities.every((municipality) => municipality.id > 0)
      ).toBeTruthy();
    }));

    it('every label should have value', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const municipalities = await service.getMunicipalities().toPromise();
      expect(
        municipalities.every((municipality) => municipality.label)
      ).toBeTruthy();
    }));

    it('should cache result', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      await service.getMunicipalities().toPromise();
      expect(service['municipalityData'].length > 0).toBeTruthy();
    }));

    it('should map correct property values', fakeAsync(async () => {
      const service: LocationService = TestBed.inject(LocationService);
      const municipalities = await service.getMunicipalities().toPromise();
      const expectedMunicipality = municipalities.find(
        (municipality) => municipality.id === DEFAULT_MUNICIPALITY_ID
      );
      expect(expectedMunicipality).toBeTruthy();
      expect(expectedMunicipality.label).toEqual(DEFAULT_MUNICIPALITY_LABEL);
    }));
  });

  describe('getMunicipalityBarangays()', () => {
    describe('municipality with barangay', () => {
      const munucipalityIdWithBarangay = DEFAULT_MUNICIPALITY_ID;
      it('should return at least 1 barangay/s', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const barangays = await service
          .getMunicipalityBarangays(munucipalityIdWithBarangay)
          .toPromise();
        expect(barangays).toBeTruthy();
        expect(barangays.length > 0).toBeTruthy();
      }));

      it('every id should have value', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const barangays = await service
          .getMunicipalityBarangays(munucipalityIdWithBarangay)
          .toPromise();
        expect(barangays.every((barangay) => barangay.id > 0)).toBeTruthy();
      }));

      it('every label should have value', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const barangays = await service
          .getMunicipalityBarangays(munucipalityIdWithBarangay)
          .toPromise();
        expect(barangays.every((barangay) => barangay.label)).toBeTruthy();
      }));

      it('should map correct property values', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const barangays = await service
          .getMunicipalityBarangays(munucipalityIdWithBarangay)
          .toPromise();
        const expectedBarangay = barangays.find(
          (barangay) => barangay.id === DEFAULT_BARANGAY_ID
        );
        expect(expectedBarangay).toBeTruthy();
        expect(expectedBarangay.label).toEqual(DEFAULT_BARANGAY_LABEL);
      }));
    });

    describe('Municipality without barangay', () => {
      const municipalityIdWithoutBarangay = -99;
      it('should return exactly zero result', fakeAsync(async () => {
        const service: LocationService = TestBed.inject(LocationService);
        const barangays = await service
          .getMunicipalityBarangays(municipalityIdWithoutBarangay)
          .toPromise();
        expect(barangays).toBeTruthy();
        expect(barangays.length).toEqual(0);
      }));
    });
  });
});
