import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {RecommendationPage} from './recommendation-page.component';
import {SharedModule as SharedModuleV2} from '../v2/shared/shared.module';
import {LocationModule} from '../location/location.module';
import * as AdminSharedModule from '../data-admin/shared/shared.module';
import {SplittingFertilizerResourcesComponent} from './components/splitting-fertilizer-resources/splitting-fertilizer-resources.component';
import {FertilizerResourcesOutputComponent} from './components/fertilizer-resources-output/fertilizer-resources-output.component';
import {RecommendationSummaryComponent} from './components/recommendation-summary/recommendation-summary.component';
import {FarmLotRecommendationFormComponent} from './components/farm-lot-recommendation-form/farm-lot-recommendation-form.component';
import {TargetYieldComponent} from './components/target-yield/target-yield.component';
import { FertlizerRatesRecommendationFormComponent } from './components/fertlizer-rates-recommendation-form/fertlizer-rates-recommendation-form.component';
import {OtherCropManagementComponent} from './components/other-crop-management/other-crop-management.component';
import {OtherCropManagementOutputComponent} from './components/other-crop-management-output/other-crop-management-output.component';
import {TargetYieldOutputComponent} from './components/target-yield-output/target-yield-output.component';
import {MatStepperModule} from '@angular/material/stepper';
import {RecommendationTimelineComponent} from './components/recommendation-timeline/recommendation-timeline.component';
import {ImageModalComponent} from './components/image-modal/image-modal.component';
import {IrrigationLabelPipe} from './pipe/irrigation-label.pipe';
import {RoundUpPipe} from './pipe/round-up.pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {KgToBagsPipe} from './pipe/kg-to-bags.pipe';
import { SmsNotificationComponent } from './components/sms-notification/sms-notification.component';
import { CustomDialectTranslationPipe } from './pipe/custom-dialect-translation.pipe';
import { CanDeactivateRecommendationGuard } from '../v2/core/guards/can-deactivate-recommendation.guard';

export class LazyTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(import(`../../../src/assets/i18n/${lang}.json`));
  }
}

const routes: Routes = [
  {
    path: '',
    component: RecommendationPage,
    canDeactivate: [CanDeactivateRecommendationGuard]
  },
  {
    path: ':referenceId',
    component: RecommendationPage
  },
  {
    path: ':referenceId/update',
    component: RecommendationPage,
    canDeactivate: [CanDeactivateRecommendationGuard]
  },
];

@NgModule({
  entryComponents: [ImageModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModuleV2,
    LocationModule,
    MatStepperModule,
    AdminSharedModule.SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      defaultLanguage: 'english',
      loader: {
        provide: TranslateLoader,
        useClass: LazyTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    RecommendationPage,
    FarmLotRecommendationFormComponent,
    TargetYieldComponent,
    TargetYieldOutputComponent,
    FertlizerRatesRecommendationFormComponent,
    SplittingFertilizerResourcesComponent,
    OtherCropManagementComponent,
    OtherCropManagementOutputComponent,
    SmsNotificationComponent,
    RecommendationSummaryComponent,
    FertilizerResourcesOutputComponent,
    RecommendationTimelineComponent,
    ImageModalComponent,
    IrrigationLabelPipe,
    RoundUpPipe,
    KgToBagsPipe,
    CustomDialectTranslationPipe
  ],
  providers: [
    IrrigationLabelPipe,
    RoundUpPipe,
    CustomDialectTranslationPipe
  ]
})
export class RecommendationPageModule {}
