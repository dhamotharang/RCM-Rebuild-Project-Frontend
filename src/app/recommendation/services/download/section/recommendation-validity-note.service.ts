import { RecommendationSummary } from 'src/app/recommendation/model/translation.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecommendationValidityNoteService {

  public noticeLabel: string;
  public sowingMonth: string;
  constructor() { }

  public setLanguage(dialectTranslation: { RECOMMENDATION_SUMMARY: RecommendationSummary; }) {
    let recommendationSummaryDialect = dialectTranslation.RECOMMENDATION_SUMMARY;

    this.noticeLabel = recommendationSummaryDialect.NOTE;
  }

  public recommendationValidityNote(
  sowingMonth: string, 
  sowingDateYear: string) {

    return { 'text': (this.noticeLabel + ' ' + sowingMonth + ' ' + sowingDateYear), 'bold': true };
  }
}
