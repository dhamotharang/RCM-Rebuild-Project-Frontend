import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { YesNo } from 'src/app/v2/core/enums/yes-no.enum';
import { RecommendationModel } from 'src/app/recommendation/model/recommendation-model';
import { Dialect } from 'src/app/recommendation/enum/dialect.enum';
import { Language } from '../../enum/language.enum';
import { SmsDialectModel } from 'src/app/recommendation/model/sms-dialect.model';
import { FieldInfoRecommendationModel } from 'src/app/recommendation/model/field-info-recommendation.model';
import { Establishment } from 'src/app/recommendation/enum/establishment.enum';
import { WaterSource } from 'src/app/recommendation/enum/water-source.enum';
import { TargetYieldModel } from 'src/app/recommendation/model/target-yield.model';
import { add } from 'date-fns';
import { SeedlingAge } from '../../enum/seedling-age.enum';
import { PhoneOwner } from 'src/app/farmer-management/enums/phone-owner.enum';

@Component({
  selector: 'app-sms-notification',
  templateUrl: './sms-notification.component.html',
  styleUrls: ['./sms-notification.component.scss'],
})
export class SmsNotificationComponent implements OnInit {

  @Input() farmerNameDisplay: string;
  @Input() farmerMobileNumber: string;
  @Input() smsNotificationForm: FormGroup;
  @Input() wasTheRecommendationSaved: boolean;
  @Input() phoneOwner: PhoneOwner;

  private _fieldInfoRecommendation;
  @Input() public set fieldInfoRecommendation(fieldInfoRecommendation: FieldInfoRecommendationModel) {
    this._fieldInfoRecommendation = fieldInfoRecommendation;

  }
  public get fieldInfoRecommendation() {
    return this._fieldInfoRecommendation;
  }

  private _targetYield;
  @Input() public set targetYield(targetYield: TargetYieldModel) {
    this._targetYield = targetYield;
  }
  public get targetYield() {
    return this._targetYield;
  }

  private _recommendation;
  @Input() public set recommendationModel(recommendation: RecommendationModel) {
    this._recommendation = recommendation;
    if (recommendation) {
      this.setSmsAnswer();
      this._recommendation = recommendation;
    } else {
      this._recommendation = null;
    }
  }
  public get recommendationModel() {
    return this._recommendation;
  }

  @Output() formSubmit: EventEmitter<void> = new EventEmitter();
  @Output() formValid: EventEmitter<SmsDialectModel> = new EventEmitter();

  public receivingSmsNotification: number;
  public isSmsNotificationAnswered: boolean = false;
  public dialectSelected: Dialect;
  public willTransplantingOccur: YesNo;

  constructor(
    private dialectTranslationService: DialectTranslationService
  ) {
  }

  ngOnInit() {
    const smsReceiveValidator = this.displayReceiveSmsQuestion() ? [Validators.required] : null;
    const transplantingWillOccurValidator = this.displayReceiveSmsQuestion() && this.displayTransplantingWillOccurQuestion() ? [Validators.required] : null;

    if (this.smsNotificationForm) {
      this.smsNotificationForm.addControl(
        'receiveSms', new FormControl(null, smsReceiveValidator)
      );
      this.smsNotificationForm.addControl(
        'dialect', new FormControl(null, [Validators.required])
      );
      this.smsNotificationForm.addControl(
        'transplantingWillOccur', new FormControl(null, transplantingWillOccurValidator)
      );
    } else {
      this.smsNotificationForm = new FormGroup({
        receiveSms: new FormControl(null, smsReceiveValidator),
        dialect: new FormControl(null, [Validators.required]),
        transplantingWillOccur: new FormControl(null, transplantingWillOccurValidator),
      });
    }
  }

  public yesNoValue = YesNo;
  public dialectValue = Dialect;
  public isTransplantingWillOccurQuestionDisplayed = false;

  public displayReceiveSmsQuestion() {
    if (this.wasTheRecommendationSaved && this.recommendationModel) {
      this.phoneOwner = this.recommendationModel.phoneOwner;
    }
    return this.phoneOwner == PhoneOwner.SELF || this.phoneOwner == PhoneOwner.SON_OR_DAUGHTER || this.phoneOwner == PhoneOwner.SPOUSE;
  }

  public onReceiveSmsChange(event) {
    if (!this.recommendationModel) {
      this.receivingSmsNotification = event.target.value;

      const transplantingWillOccurFormControl = this.smsNotificationForm.controls.transplantingWillOccur;

      if (this.receivingSmsNotification == YesNo.NO) {
        transplantingWillOccurFormControl.reset();
        transplantingWillOccurFormControl.clearValidators();
        this.isTransplantingWillOccurQuestionDisplayed = false;
      } else {
        if (this.displayTransplantingWillOccurQuestion()) {
          transplantingWillOccurFormControl.setValidators([Validators.required]);
          this.isTransplantingWillOccurQuestionDisplayed = true;
        } else {
          transplantingWillOccurFormControl.reset();
          transplantingWillOccurFormControl.clearValidators();
          this.isTransplantingWillOccurQuestionDisplayed = false;
        } 
      }
      transplantingWillOccurFormControl.updateValueAndValidity();
    }
  }

  public onTransplantingWillOccurChange(event) {
    this.willTransplantingOccur = event.target.value;
  }

  public upperTransplantingDate: Date;
  public lowerTransplantingDate: Date;

  public displayTransplantingWillOccurQuestion(): boolean {
    if (this.targetYield) {
      this.isTransplantingWillOccurQuestionDisplayed = false;
      const isTransplanting = this.targetYield.establishment == Establishment.MANUAL.toString() || this.targetYield.establishment == Establishment.MECHANICAL.toString();
      const isIrrigated = this.fieldInfoRecommendation.waterSource == WaterSource.IRRIGATED;

      if (isTransplanting && isIrrigated) {

        const seedlingAge = this.targetYield.seedlingAge;
        const sowingDate = this.targetYield.sowingDate;
        const today = new Date();
        
        let daysLowerLimit = 0;
        let daysUpperLimit = 0;

        if (seedlingAge == SeedlingAge.MIDDLE_SEEDLING_AGE.toString()) {
          daysLowerLimit = 15;
          daysUpperLimit = 22;
        } else if (seedlingAge == SeedlingAge.MIDDLE_SEEDLING_AGE.toString()) {
          daysLowerLimit = 23;
          daysUpperLimit = 25;
        } else {
          daysLowerLimit = 10;
          daysUpperLimit = 14;
        }

        const transplantingDate = add(sowingDate, {
          days: daysUpperLimit
        });

        if (transplantingDate > today && sowingDate <= today) {
          this.lowerTransplantingDate = add(sowingDate, {
            days: daysLowerLimit
          });
          this.upperTransplantingDate = transplantingDate;
          this.isTransplantingWillOccurQuestionDisplayed = true;

          return this.isTransplantingWillOccurQuestionDisplayed;
        }
      }
      return this.isTransplantingWillOccurQuestionDisplayed;
    }
  }

  public onDialectSelectionChange(event) {
    this.dialectSelected = event.target.value;
    const dialect = this.dialectTranslationService.dialectSelection(event.target.value);
    this.dialectTranslationService.setDialectSelected(dialect);
  }

  public onSmsNotificationSubmit() {
    this.smsNotificationForm.markAllAsTouched();
    if (this.smsNotificationForm.valid) {
      const smsAndDialectModel: SmsDialectModel = {
        receiveSms: !!this.receivingSmsNotification ? this.receivingSmsNotification : null,
        dialect: this.dialectSelected,
        transplantingWillOccur: !!this.willTransplantingOccur ? this.willTransplantingOccur : null,
        transplantingOccurLowerDate: this.receivingSmsNotification == YesNo.YES && !!this.willTransplantingOccur ? this.lowerTransplantingDate.toLocaleDateString() : null,
        transplantingOccurUpperDate: this.receivingSmsNotification == YesNo.YES && !!this.willTransplantingOccur ? this.upperTransplantingDate.toLocaleDateString() : null,
      };
      this.formValid.emit(smsAndDialectModel);
    }
    this.formSubmit.emit();
  }

  public setSmsAnswer() {
    if (this.recommendationModel) {
      this.smsNotificationForm.controls.receiveSms.disable();
      this.smsNotificationForm.controls.dialect.disable();
      this.smsNotificationForm.controls.transplantingWillOccur.disable();

      let dialectValue = Dialect.ENGLISH;

      if (!this.recommendationModel.smsAndDialect.dialect) {
        dialectValue = this.recommendationModel.previousSelectedLanguage == Language.ENGLISH ? Dialect.ENGLISH : Dialect.TAGALOG;
      } else {
        dialectValue = this.recommendationModel.smsAndDialect.dialect;
      }

      if (this.recommendationModel.smsAndDialect.transplantingWillOccur) {
        this.isTransplantingWillOccurQuestionDisplayed = true;
        this.lowerTransplantingDate = new Date(this.recommendationModel.smsAndDialect.transplantingOccurLowerDate);
        this.upperTransplantingDate = new Date(this.recommendationModel.smsAndDialect.transplantingOccurUpperDate);
      }

      this.smsNotificationForm.patchValue({
        receiveSms: this.recommendationModel.smsAndDialect.receiveSms ? this.recommendationModel.smsAndDialect.receiveSms : YesNo.NO,
        dialect: dialectValue,
        transplantingWillOccur: this.recommendationModel.smsAndDialect.transplantingWillOccur,
      })

    }
  }

  public editForm() {
    this.smsNotificationForm.enable();
  }

  public get isFormDisabled() {
    return this.smsNotificationForm.disabled;
  }
}
