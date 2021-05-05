import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { Injectable } from '@angular/core';
import { PdfRecommendationLogo } from 'src/app/recommendation/enum/pdf-recommendation-logo.enum';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  constructor() {}

  public createPdfFormattedFooter(loggedInUser: UserLoginModel) {
    const rowSpanValue = 3;
    //default pdfmake font size unit is pt
    const fontSizeValue = 8;
    const imageSize = 35;

    return {
      alignment: 'center',
      layout: 'noBorders',
      table: {
        widths: ['auto', 'auto', '*', 'auto', 'auto'],
        body: [
          [
            {
              image: PdfRecommendationLogo.DA_LOGO,
              rowSpan: rowSpanValue,
              fit: [imageSize, imageSize],
            },
            {
              image: PdfRecommendationLogo.ATI_LOGO,
              rowSpan: rowSpanValue,
              fit: [imageSize, imageSize],
            },
            {
              text: ['For questions, contact: ', this.getUserDetails(loggedInUser)],
            },
            {
              image: PdfRecommendationLogo.DA_BAR_LOGO,
              rowSpan: rowSpanValue,
              fit: [imageSize, imageSize],
            },
            {
              image: PdfRecommendationLogo.PHIL_RICE_LOGO,
              rowSpan: rowSpanValue,
              fit: [imageSize, imageSize],
            },
          ],
          [
            '',
            '',
            {
              text: [
                'Consult PalayCheck for good management practices\n during the season.',
                {
                  text: 'https://www.pinoyrice.com/',
                  color: '#0000EE',
                },
              ],
              bold: true,
            },
          ],
          ['', '', { text: '© International Rice Research Institute 2020' }],
        ],
      },
      margin: [20, 0],
      fontSize: fontSizeValue,
    };
  }

  private getUserDetails(loggedInUser: UserLoginModel) {
    return `${loggedInUser.firstName } ${loggedInUser.lastName} | ${loggedInUser.mobileNumber}`;
  }
}
