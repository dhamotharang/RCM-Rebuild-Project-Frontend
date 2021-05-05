import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { FarmerFilterModel } from 'src/app/farmer-management/models/farmer-filter.model';
import { UserLoginModel } from 'src/app/login/models/user-login.model';
import { FARMER_LIST_PDF_HEADER } from '../constants/pdf-headers';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FarmerDownloadModel } from 'src/app/farmer-management/models/farmer-download.model';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  public async createFarmerListPdf(
    farmersData: FarmerDownloadModel[],
    farmerFilter: FarmerFilterModel,
    user: UserLoginModel
  ) {
    const withQuickFilters =
      farmerFilter &&
      (farmerFilter.idGenerated ||
        farmerFilter.interviewedByMe ||
        farmerFilter.notVerifiedField ||
        farmerFilter.verifiedField);

    const quickFilters = [];

    if (farmerFilter.idGenerated) {
      quickFilters.push('ID Generated');
    }

    if (farmerFilter.interviewedByMe) {
      quickFilters.push('Interviewed By Me');
    }

    if (farmerFilter.notVerifiedField) {
      quickFilters.push('Not Verified Field');
    }

    if (farmerFilter.verifiedField) {
      quickFilters.push('Verified Field');
    }

    const d = new Date();
    const fileName =
      `FFRList-${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-` +
      (farmerFilter.barangayId == -1
        ? farmerFilter.municipalityName
        : farmerFilter.municipalityName + '-' + farmerFilter.barangayName);
    const userName = user.firstName + ' ' + user.lastName;

    const disclaimer = {
      stack: [
        {
          text: [
            'This information is made available to the Department of Agriculture Regional Field Offices (DA-RFOs) as guide in conducting RCM farmer’s field measurement\n',
            'using handheld GPS device. This document contains sensitive personal information of RCM farmers covered by the Data Privacy Act of 2012. This information\n',
            'cannot be used for purposes other than the stated above. IRRI is not liable for any misuse of this downloaded information.\n',
          ],
          margin: [20, 0, 0, 0],
          fontSize: 11,
        },
      ],
    };

    const notes = {
      stack: [
        {
          text: [
            '1) Value under column "Declared Field Size" indicates the farmer-declared field size during farmer and field registration\n',
            '2) "YES" under column "Verified?" means that field was already measured using handheld GPS device and track was already submitted and verified\n',
            '3) Value under column "Verified Field Size" indicates the GPS-measured field size\n',
            '4) GPX Field ID is the unique code assigned to each field and should be used for naming the GPS track after measuring the field"',
          ],
          fontSize: 11,
          italics: true,
        },
      ],
    };

    const headerDetails = [
      {
        width: 350,
        text: [
          'Region: ' + farmerFilter.regionName + '\n',
          'Province: ' + farmerFilter.provinceName + '\n',
          'Municipality: ' + farmerFilter.municipalityName + '\n',
          'Barangay: ' +
            (farmerFilter.barangayId === -1
              ? 'All Barangays'
              : farmerFilter.barangayName) +
            '\n',
        ],
      },
      {
        width: '*',
        text: [
          'Date of download: ' + formatDate(d, 'MMM-dd-yyyy', 'en-US') + '\n',
          !!farmerFilter.interviewDateFrom
            ? 'Inclusive of date of survey: ' +
              farmerFilter.interviewDateFrom +
              ' to ' +
              farmerFilter.interviewDateFrom +
              '\n'
            : '',
          'Downloaded by: ' + userName + '\n',
          ' ',
          withQuickFilters ? 'Other filters: ' : '',
          withQuickFilters ? quickFilters.join(', ') : '',
        ],
      },
    ];

    const dd = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 20, 20],
      content: [
        {
          text:
            'List of RCM farmers and fields for GPS measurement and fields with verified field size.',
          fontSize: 13,
          bold: true,
        },
        ' ',
        {
          alignment: 'justify',
          columns: headerDetails,
        },
        ' ',
        { text: 'Disclaimer:', fontSize: 11 },
        disclaimer,
        ' ',
        { text: 'Notes:', fontSize: 11 },
        notes,
        ' ',
        this.createPdfTableForFarmers(farmersData),
      ],
    };
    pdfMake.createPdf(dd).download(fileName);
  }

  private createPdfTableForFarmers(farmers: FarmerDownloadModel[]) {
    return {
      table: {
        headerRows: 1,
        heights: [50],
        widths: [60, 90, 80, 65, 90, 100, 50, 75, 50, 50],
        body: this.buildTableBodyForFarmers(farmers),
      },
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? '#1BBD9C' : null;
        },
      },
    };
  }

  private buildTableBodyForFarmers(farmers: FarmerDownloadModel[]) {
    const pdfHeaders = FARMER_LIST_PDF_HEADER;
    const body = [];

    const columnHeaders = [];

    pdfHeaders.forEach(function (column) {
      columnHeaders.push(column.header_value);
    });

    body.push(columnHeaders);

    farmers.forEach(function (row) {
      const dataRow = [];

      pdfHeaders.forEach(function (column) {
        let data = { text: row[column.key].toString(), fontSize: 10 };
        dataRow.push(data);
      });

      body.push(dataRow);
    });

    return body;
  }
}
