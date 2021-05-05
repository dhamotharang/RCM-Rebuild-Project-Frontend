import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';
import { CustomDialectTranslationPipe } from 'src/app/recommendation/pipe/custom-dialect-translation.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FertilizerResourcesOutputComponent } from './fertilizer-resources-output.component';
import { FertilizerInputService } from 'src/app/recommendation/services/computation/fertilizer-input.service';
import { GrowthDurationService } from 'src/app/recommendation/services/computation/growth-duration.service';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { KgToBagsPipe } from 'src/app/recommendation/pipe/kg-to-bags.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('FertilizerResourcesOutputComponent', () => {
  let component: FertilizerResourcesOutputComponent;
  let fixture: ComponentFixture<FertilizerResourcesOutputComponent>;
  let fertilizerInputService: FertilizerInputService;
  let growthDurationService: GrowthDurationService;
  let dialectTranslationService: DialectTranslationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FertilizerResourcesOutputComponent, KgToBagsPipe, CustomDialectTranslationPipe],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FertilizerResourcesOutputComponent);
    component = fixture.componentInstance;

    fertilizerInputService = TestBed.inject(FertilizerInputService);
    dialectTranslationService = TestBed.inject(DialectTranslationService);

    const fertilizerRecommendation = fertilizerInputService.compute(
      27.5909814, //pRate
      26, //kRate
      20, // N Early
      37.5, // N Active Tillering
      37.4375, // N Panicle Initiation
      20, // N Heading
      false, //useAmmosul
      1.4567, //ha
      7.5, //target yield
      2); //variety type - inbred

    growthDurationService = TestBed.inject(GrowthDurationService);

    const growthDurationRecommendationModel = growthDurationService.computeGD(
      1, //crop establishment - Manual transplanting
      1, //growth duration - 101-110 days
      2, //seedling age - 15-22 days seedling
      true, //activeTillering - 3 splits
      2, //irrigation - irrigated
    );

    fertilizerRecommendation.growthDuration = growthDurationRecommendationModel;

    component = fixture.componentInstance;
    component.fertilizerRecommendationModel = fertilizerRecommendation as TimingAndFertilizerSourcesModel;
    component.fertilizerRecommendationModel.showHeading = true;
    component.fertilizerRecommendationModel.showEarlyFert = true;
    component.dialectSelected = 'english';

    fixture.detectChanges();
  });

  it('SplittingFertilizerResourcesComponent be created', () => {
    expect(component).toBeTruthy();
    expect(fertilizerInputService).toBeTruthy();
    expect(growthDurationService).toBeTruthy();
    expect(dialectTranslationService).toBeTruthy();
  });

  it('Early critical stage, fert source and fert amount', () => {
    expect(component.fertilizerRecommendationModel.growthStages[0].growthStageName).toBe('Early');

    const datEarly = fixture.debugElement.nativeElement.querySelector('#datEarly');
    expect(datEarly.innerHTML).toContain('Basal - 10');

    expect(component.fertilizerRecommendationModel.growthStages[0].fertilizerSources[0].fertilizerSource).toBe('14-14-14 with sulfur');

    const earlyFertAmount = fixture.debugElement.nativeElement.querySelector('#earlyFert');
    // todo
    // expect(earlyFertAmount.innerHTML).toContain('5 bags and 37 kg');
  });

  it('Active tillering critical stage, fert source and fert amount', () => {
    expect(component.fertilizerRecommendationModel.growthStages[1].growthStageName).toBe('Active Tillering');

    const datAT = fixture.debugElement.nativeElement.querySelector('#datAT');
    expect(datAT.innerHTML).toContain('17 - 21');

    expect(component.fertilizerRecommendationModel.growthStages[1].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');

    const atFertAmount = fixture.debugElement.nativeElement.querySelector('#atFert');
    // todo
    // expect(atFertAmount.innerHTML).toContain('1 bag and 45 kg');
  });

  it('Panicle initiation critical stage, fert source and fert amount', () => {
    expect(component.fertilizerRecommendationModel.growthStages[2].growthStageName).toBe('Panicle Initiation');

    const datPI = fixture.debugElement.nativeElement.querySelector('#datPI');
    expect(datPI.innerHTML).toContain('28 - 32');

    expect(component.fertilizerRecommendationModel.growthStages[2].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');

    const piFertAmount = fixture.debugElement.nativeElement.querySelector('#piFert');
    // todo
    // expect(piFertAmount.innerHTML).toContain('2 bags and 19 kg');
  });

  it('Heading critical stage, fert source and fert amount', () => {
    expect(component.fertilizerRecommendationModel.growthStages[3].growthStageName).toBe('Heading');

    const datHD = fixture.debugElement.nativeElement.querySelector('#datHD');
    expect(datHD.innerHTML).toContain('52 - 58');

    expect(component.fertilizerRecommendationModel.growthStages[3].fertilizerSources[0].fertilizerSource).toBe('Urea (46-0-0)');

    const hdFertAmount = fixture.debugElement.nativeElement.querySelector('#hdFert');
    // todo
    // expect(hdFertAmount.innerHTML).toContain('1 bag and 13 kg');
  });

});
