import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor() {}

  public pdfFormattedHeader() {
    return {
      layout: 'noBorders',
      table: {
        widths: ['100%'],
        body: [
          [
            {
              bold: true,
              color: '#ffffff',
              alignment: 'center',
              fillColor: '#61c419',
              text: 'RICE CROP MANAGER PHILIPPINES',
            },
          ],
        ],
      },
    };
  }
}
