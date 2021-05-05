import { DialectTranslationService } from 'src/app/recommendation/services/dialect-translation.service';
import { CustomDialectTranslationPipe } from './custom-dialect-translation.pipe';

let test: DialectTranslationService;
describe('CustomDialectTranslationPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDialectTranslationPipe(test);
    expect(pipe).toBeTruthy();
  });
});
