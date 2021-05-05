import { Component, OnInit, OnChanges, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { TimingAndFertilizerSourcesModel } from 'src/app/recommendation/model/timing-and-fertilizer-sources-model';
import { TimelineImageService } from 'src/app/recommendation/services/timeline-image.service';
import { TimelineImageModel } from 'src/app/recommendation/model/timeline-image.model';
import { GrowthStageImageModel } from 'src/app/recommendation/model/growth-stage-image.model';
import {
  SEED_BASE64IMG,
  NURSERY_BASE64IMG,
  FERTILIZER_BASE64IMG,
  HAND_WEED_BASE64IMG
} from 'src/app/recommendation/constant/timeline-images.constant';
import { FarmingRecommendationPracticesOutputModel } from 'src/app/recommendation/model/farming-recommendation-practices-output.model';
import { DayDurationModel } from 'src/app/recommendation/model/day-duration.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';

@Component({
  selector: 'app-recommendation-timeline',
  templateUrl: './recommendation-timeline.component.html',
  styleUrls: ['./recommendation-timeline.component.scss'],
})
export class RecommendationTimelineComponent implements OnInit, OnChanges {
  @ViewChild('timelineCanvas') timelineCanvas: ElementRef;
  @ViewChild('blankCanvas') blankCanvas: ElementRef;
  @Output() composeTimeline = new EventEmitter();

  private _dialect;
  @Input() public set dialectSelected(dialect: string) {
    this._dialect = dialect;
  }
  public get dialectSelected() {
    return this._dialect;
  }

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;

  }
  public get targetYield() {
    return this._targetYield;
  }
  private _fertilizerRecommendationModel;
  @Input() public set fertilizerRecommendationModel(fertilizerRecommendationModel: TimingAndFertilizerSourcesModel) {
    this._fertilizerRecommendationModel = fertilizerRecommendationModel;

  }
  public get fertilizerRecommendationModel() {
    return this._fertilizerRecommendationModel;
  }

  private _farmingPractices;
  @Input() public set farmingPractices(farmingPractices: FarmingRecommendationPracticesOutputModel) {
    this._farmingPractices = farmingPractices;

  }
  public get farmingPractices() {
    return this._farmingPractices;
  }

  public timelineImageModel: TimelineImageModel;
  public svgDraw = SVG();

  rulerLength: number = 0;
  rulerLineThickness: number = 3;

  rulerMarginLeft: number = 130;
  rulerMarginTop: number = 340;

  growthStageMarginTop: number = 330;

  lineColor: string = "#000";
  hatchThickness: number = 2;
  hatchSeperatorLength: number = this.hatchThickness * 2;

  fertImageMarginTop: number = 170;
  fertImageWidth: number = 50;
  fertImageHeight: number = 50;

  growthStageLabelMinMarginTop: number = 235;
  growthStageLabelNextLineMarginTop: number = 250;
  growthStageRiceImageMarginTop: number = 245;
  growthStageRiceImageHeight: number = 30

  constructor(
    private timelineImageService: TimelineImageService, 
    public translateService: TranslateService,
    public dialectTranslationService: DialectTranslationService,
  ) {
  }

  ngOnInit() {

  }

  async ngOnChanges() {
    await this.generateTimeline();
  }

  async generateTimeline() {
    this.rulerLength = 0;
    this.svgDraw.node.innerHTML = '';
    this.svgDraw.attr('id', 'svgTimeline').width(820).height(500);
    await this.generateTimelineImageModel();
    if (this.timelineImageModel.hasSeedbed) {
      this.drawSeedImage();
    }

    if (this.timelineImageModel.hasSeedbed) {
      this.drawSeedBedImage();
    }

    this.drawRulerHatchMarks(
      this.rulerLength,
      this.rulerMarginTop,
      this.rulerMarginLeft,
      this.hatchThickness,
      this.hatchSeperatorLength,
      this.timelineImageModel.maxDays,
      this.timelineImageModel.daysAfterLabel
    );

    this.drawRulerLine(
      this.rulerMarginTop,
      this.rulerMarginLeft,
      this.rulerLength,
      this.rulerLineThickness
    );

    this.drawGrowthStages();

    if (this.timelineImageModel.showKeepFloodedBelow5cm) {
      this.drawKeepFlooded();
    }

    if (this.timelineImageModel.showPracticeSafeAwd) {
      this.drawPracticeSafeAwd();
    }
    this.resetTextDYPosition();

    this.composeSVG();
  }

  public resetTextDYPosition() {
    const textElements = document.getElementsByTagName("text");

    for(var i = 0; i < textElements.length; i++) {
      textElements[i].firstElementChild.setAttribute('dy', '0');
    }
  }

  public drawSeedImage() {
    const seedWidth = 17;
    const seedHeight = 13;
    const seedMarginLeft = 0;
    const seedMarginTop = this.rulerMarginTop;
    this.drawImage(SEED_BASE64IMG, seedWidth, seedHeight, seedMarginLeft, seedMarginTop);
  }

  public drawSeedBedImage() {
    const seedBedWidth = 70;
    const seedBedHeight = 30;
    const seedBedMarginLeft = 40;
    const seedBedMarginTop = (this.rulerMarginTop - 20);
    const seedBedVerticalAlign = seedBedMarginLeft + 5;
    const seedBedHorizontalAlign = seedBedMarginTop + 50;
    this.drawImage(NURSERY_BASE64IMG, seedBedWidth, seedBedHeight, seedBedMarginLeft, seedBedMarginTop);
    this.svgDraw.text(this.timelineImageModel.seedBedLabel).width(80).amove(seedBedVerticalAlign, seedBedHorizontalAlign);

  }

  public drawRulerHatchMarks(
    rulerLength: number,
    rulerMarginTop: number,
    rulerMarginLeft: number,
    hatchThickness: number,
    hatchSeperatorLength: number,
    maxDays: number,
    cropEstablishment: string
  ) {

    let hatchHeight = 0;

    let hatchMarginLeft = 0;
    const hatchMarginTop = 380;

    const hatchBase10NumberingTextStyle = { fill: '#000', size: '10pt', weight: 'bold' };

    for (let i = 0; i <= maxDays; i++) {

      hatchHeight = 13
      if (i % 10 === 0) {
        hatchHeight = 21;

        hatchMarginLeft = rulerMarginLeft - hatchThickness;
        this.svgDraw.text(i + '').amove(hatchMarginLeft, hatchMarginTop).font(hatchBase10NumberingTextStyle);
      }

      this.svgDraw.rect(hatchThickness, hatchHeight).move(rulerMarginLeft, rulerMarginTop).fill(this.lineColor);

      rulerMarginLeft += hatchSeperatorLength;
      rulerLength += hatchSeperatorLength;
    }

    this.rulerLength = rulerLength - hatchThickness;
    this.drawEndingtexts(cropEstablishment, rulerMarginLeft, rulerMarginTop)
  }

  public drawRulerLine(rulerMarginTop: number, rulerMarginLeft: number, rulerLength: number, rulerLineThickness: number) {
    this.drawRectangle(rulerLength, rulerLineThickness, rulerMarginLeft, rulerMarginTop)
  }

  public drawEndingtexts(cropEstablishment: string, marginLeft: number, marginTop: number) {

    const extractCropEstablishment = cropEstablishment.split(" ");
    const verticalAlign = marginLeft + 10;
    const daysHorizontalAlign = marginTop - 10;
    const afterHorizontalAlign = marginTop + 7;
    const cropEstablishmentHorizontalAlign = marginTop + 20;

    const setPracticeSafeAwdVerticalAlign = marginLeft;
    const setPracticeSafeAwdHorizontalAlign = marginTop + 65;

    this.svgDraw.text(extractCropEstablishment[0]).width(30).amove(verticalAlign, daysHorizontalAlign);
    this.svgDraw.text(extractCropEstablishment[1]).width(30).amove(verticalAlign, afterHorizontalAlign);
    if (extractCropEstablishment[2]) {
      this.svgDraw.text(extractCropEstablishment[2]).width(50).amove(verticalAlign, cropEstablishmentHorizontalAlign);
    }

    if (this.timelineImageModel.showPracticeSafeAwd) {
      this.svgDraw.text(this.timelineImageModel.practiceSafeAwdLabel).width(80).amove(
        setPracticeSafeAwdVerticalAlign,
        setPracticeSafeAwdHorizontalAlign
      );
    }
  }

  public shapePlacementOnRuler(dayStart: number, dayEnd: number) {

    const marginLeft = (dayStart * this.hatchSeperatorLength) + this.rulerMarginLeft;

    const endPoint = dayEnd - dayStart;
    const shapeWidth = endPoint * this.hatchSeperatorLength;
    const shapeHeight = 5; // preference base

    return {
      'width': shapeWidth,
      'height': shapeHeight,
      'marginLeft': marginLeft,
      'marginTop': this.growthStageMarginTop
    }
  }

  public drawGrowthStages() {
    const earlyDays = this.timelineImageModel.growthStages.find(growthStage => growthStage.stageName === 'early');
    const activeTilleringDays = this.timelineImageModel.growthStages.find(growthStage => growthStage.stageName === 'active-tillering');

    if (activeTilleringDays.dayStart) {
      this.drawActiveTilleringStage(activeTilleringDays);
    }
    const pannicleInitiationDays = this.timelineImageModel.growthStages.find(growthStage => growthStage.stageName === 'panicle-initiation');
    const headingDays = this.timelineImageModel.growthStages.find(growthStage => growthStage.stageName === 'heading');
    const harvestDays = this.timelineImageModel.growthStages.find(growthStage => growthStage.stageName === 'harvest');

    this.drawEarlyStage(earlyDays);
    this.drawPanicleInitiationStage(pannicleInitiationDays);
    this.drawHeadingStage(headingDays);
    this.drawHarvestStage(harvestDays);
  }

  public computeMarginLeft(days: GrowthStageImageModel): number {
    const diffPoint = days.dayEnd - days.dayStart;
    const midPoint = (diffPoint / 2) + days.dayStart;

    return (midPoint * this.hatchSeperatorLength) + this.rulerMarginLeft;
  }

  public drawEarlyStage(earlyDays: GrowthStageImageModel) {

    const shape = this.shapePlacementOnRuler(earlyDays.dayStart, earlyDays.dayEnd);

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      shape.marginTop
    );

    const offsetRiceImageMarginTop = 49;
    const marginLeft = this.computeMarginLeft(earlyDays);
    const earlyRiceImageWidth = 15;
    const earlyRiceImageHeight = 31;
    const earlyRiceImageWidthOffset = earlyRiceImageWidth / 2;

    this.drawGrowStageLegend(
      earlyDays.stageNameLabel,
      earlyRiceImageWidth,
      earlyRiceImageHeight,
      marginLeft,
      earlyDays.image,
      offsetRiceImageMarginTop,
      earlyRiceImageWidthOffset,
      true
    );
  }

  public drawActiveTilleringStage(activeTilleringDays: GrowthStageImageModel) {

    const shape = this.shapePlacementOnRuler(activeTilleringDays.dayStart, activeTilleringDays.dayEnd);

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      shape.marginTop
    );

    this.drawHandWeed(shape.marginLeft);

    const offsetRiceImageMarginTop = 36;
    const marginLeft = this.computeMarginLeft(activeTilleringDays);
    const activeTilleringRiceImageWidth = 35;
    const activeTilleringRiceImageHeight = 44;
    const activeTilleringRiceImageWidthOffset = activeTilleringRiceImageWidth / 2;

    this.drawGrowStageLegend(
      activeTilleringDays.stageNameLabel,
      activeTilleringRiceImageWidth,
      activeTilleringRiceImageHeight,
      marginLeft,
      activeTilleringDays.image,
      offsetRiceImageMarginTop,
      activeTilleringRiceImageWidthOffset,
      true
    );
  }

  public drawPanicleInitiationStage(panicleInitiation: GrowthStageImageModel) {

    const shape = this.shapePlacementOnRuler(panicleInitiation.dayStart, panicleInitiation.dayEnd);

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      shape.marginTop
    );

    this.drawHandWeed(shape.marginLeft);

    const offsetRiceImageMarginTop = 26;
    const marginLeft = this.computeMarginLeft(panicleInitiation);
    const panicleInitiationRiceImageWidth = 43;
    const panicleInitiationRiceImageHeight = 54;
    const panicleInitiationRiceImageWidthOffset = panicleInitiationRiceImageWidth / 2;

    this.drawGrowStageLegend(
      panicleInitiation.stageNameLabel,
      panicleInitiationRiceImageWidth,
      panicleInitiationRiceImageHeight,
      marginLeft,
      panicleInitiation.image,
      offsetRiceImageMarginTop,
      panicleInitiationRiceImageWidthOffset,
      true
    );
  }

  public drawHeadingStage(headingDays: GrowthStageImageModel) {

    const shape = this.shapePlacementOnRuler(headingDays.dayStart, headingDays.dayEnd);

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      shape.marginTop
    );

    const offsetRiceImageMarginTop = 8;
    const marginLeft = this.computeMarginLeft(headingDays);
    const headingRiceImageWidth = 47;
    const headingRiceImageHeight = 72;
    const headingRiceImageWidthOffset = headingRiceImageWidth / 2;

    this.drawGrowStageLegend(
      headingDays.stageNameLabel,
      headingRiceImageWidth,
      headingRiceImageHeight,
      marginLeft,
      headingDays.image,
      offsetRiceImageMarginTop,
      headingRiceImageWidthOffset
    );
  }

  public drawHarvestStage(harvestDays: GrowthStageImageModel) {

    const shape = this.shapePlacementOnRuler(harvestDays.dayStart, harvestDays.dayEnd);

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      shape.marginTop
    );

    const marginLeft = this.computeMarginLeft(harvestDays);
    const harvestRiceImageWidth = 57;
    const harvestRiceImageHeight = 80;
    const harvestRiceImageWidthOffset = harvestRiceImageWidth / 2;

    this.drawGrowStageLegend(
      harvestDays.stageNameLabel,
      harvestRiceImageWidth,
      harvestRiceImageHeight,
      marginLeft,
      harvestDays.image,
      0,
      harvestRiceImageWidthOffset
    );
  }

  public computeGrowthStagesTextLabelWidth(extractTextLabel: string): number {
    return this.svgDraw.text(extractTextLabel).font({ size: '9pt' }).opacity(0).bbox().width / 2;
  }

  public drawGrowStageLegend(
    textLabel: string,
    riceImageWidth: number,
    riceImageHeight: number,
    marginLeft: number,
    riceImage: string,
    riceImageMarginTopOffset: number,
    imageWidthOffset: number,
    hasFertImage: boolean = false
  ) {

    const extractTextLabel = textLabel.split(" ");

    if (hasFertImage) {
      const fertilizerImageWidthOffset = this.fertImageWidth / 2;
      const offsetFertilizerMarginLeft = marginLeft - fertilizerImageWidthOffset;

      this.drawImage(
        FERTILIZER_BASE64IMG,
        this.fertImageWidth,
        this.fertImageHeight,
        offsetFertilizerMarginLeft,
        this.fertImageMarginTop
      );
    }

    const textLabelWidth = this.computeGrowthStagesTextLabelWidth(extractTextLabel[0]);
    const offsetTextLabelMarginLeft = marginLeft - textLabelWidth;

    this.svgDraw.text(extractTextLabel[0]).amove(
      offsetTextLabelMarginLeft,
      this.growthStageLabelMinMarginTop
    ).font({ size: '9pt' });

    if (extractTextLabel.length === 2) {
      const textLabelNextLineWidth = this.computeGrowthStagesTextLabelWidth(extractTextLabel[1]);
      const offsetTextLabelNextLineMarginLeft = marginLeft - textLabelNextLineWidth;

      this.svgDraw.text(extractTextLabel[1]).amove(
        offsetTextLabelNextLineMarginLeft,
        this.growthStageLabelNextLineMarginTop
      ).font({ size: '9pt' });
    }
    const offsetRiceImageMarginLeft = marginLeft - imageWidthOffset;
    const offsetRiceImageMarginTop = this.growthStageRiceImageMarginTop + riceImageMarginTopOffset;

    this.drawImage(
      riceImage,
      riceImageWidth,
      riceImageHeight,
      offsetRiceImageMarginLeft,
      offsetRiceImageMarginTop,
    );
  }

  public drawHandWeed(imageMarginLeft: number) {

    const offsetMarginLeft = 50;
    const offsetMarginTop = 60;

    if (this.timelineImageModel.showHandWeed) {
      this.drawImage(
        HAND_WEED_BASE64IMG,
        this.fertImageWidth,
        this.fertImageHeight,
        imageMarginLeft - offsetMarginLeft,
        this.fertImageMarginTop - offsetMarginTop
      );
    }
  }

  public drawKeepFlooded() {
    const keepFloodedBelow5cmData: DayDurationModel =
    {
      dayStart: 21,
      dayEnd: 21 + 25 + 15
    };

    const shape = this.shapePlacementOnRuler(keepFloodedBelow5cmData.dayStart, keepFloodedBelow5cmData.dayEnd)
    const putBelowRuler = shape.marginTop + 70;

    this.drawDashedLine(
      shape.width,
      shape.height,
      shape.marginLeft,
      putBelowRuler);
  }

  public drawPracticeSafeAwd() {
    const practiceSafeAWDData: DayDurationModel =
    {
      dayStart: this.fertilizerRecommendationModel.growthDuration.headingHigh + 7,
      dayEnd: this.fertilizerRecommendationModel.growthDuration.harvestLow - 7
    };

    const shape = this.shapePlacementOnRuler(practiceSafeAWDData.dayStart, practiceSafeAWDData.dayEnd)
    const putBelowRuler = shape.marginTop + 70;

    this.drawRectangle(
      shape.width,
      shape.height,
      shape.marginLeft,
      putBelowRuler);

  }

  public drawRectangle(width: number, height: number, marginLeft: number, marginTop: number) {
    this.svgDraw.rect(width, height).move(marginLeft, marginTop).fill(this.lineColor)
  }

  public drawDashedLine(width: number, height: number, marginLeft: number, marginTop: number) {
    const whiteHex = '#FFFFFF';
    const widthPattern = 20;
    const widthRectPattern = 10;

    const pattern = this.svgDraw.pattern(widthPattern, height, function (add) {
      add.rect(widthRectPattern, height).fill(this.lineColor);
      add.rect(widthRectPattern, height).fill(whiteHex).move(width, height);
    });

    this.svgDraw.rect(width, height).move(marginLeft, marginTop).fill(pattern).attr(
      {
        stroke: this.lineColor,
        'stroke-width': 1,
      }
    );
  }

  public drawImage(
    imageSrc: string,
    width: number,
    height: number,
    marginLeft: number,
    marginTop: number
  ) {
    this.svgDraw.image(imageSrc).width(width).height(height).move(
      marginLeft,
      marginTop
    );
  }

  public isTimelineCanvasBlank() {
    const canvas = this.timelineCanvas.nativeElement;
    return canvas.toDataURL() == this.blankCanvas.nativeElement.toDataURL();
  }

  public composeSVG() {
    if (this.isTimelineCanvasBlank()) {
      this.svgDraw.addTo('#timeline');
    }
    const context = this.timelineCanvas.nativeElement.getContext("2d");
    const xml = new XMLSerializer().serializeToString(this.svgDraw.node);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image = new Image();
    const imgBase64 = b64Start + svg64;

    image.onload = () => {
      context.clearRect(0, 0, 550, 450);
      context.drawImage(image, 0, 0, 550, 450);

      const url = this.timelineCanvas.nativeElement.toDataURL();
      this.composeTimeline.emit(url);

    };
    image.src = imgBase64;
  }

  public async generateTimelineImageModel() {
    if (
      this.targetYield &&
      this.fertilizerRecommendationModel &&
      this.farmingPractices
    ) {
      await this.timelineImageService.setLanguage(parseInt(this.targetYield.establishment, 10), this.dialectSelected);
      this.timelineImageModel = this.timelineImageService.generateTimelineImage(
        this.targetYield,
        this.fertilizerRecommendationModel,
        this.farmingPractices
      );
    }
  }
}
