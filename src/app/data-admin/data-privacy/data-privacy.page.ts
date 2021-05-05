import { Component, OnInit } from '@angular/core';
import { FarmerConsentModel } from 'src/app/core/models/farmer-consent.model';
import { DataPrivacyService } from 'src/app/v2/core/services/data-privacy.service';
import { DownloadService } from 'src/app/core/services/download/download.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-data-privacy',
  templateUrl: './data-privacy.page.html',
  styleUrls: ['./data-privacy.page.scss'],
})
export class DataPrivacyPage implements OnInit {
  constructor(
    private dataPrivacyService: DataPrivacyService,
    private alertService: AlertService,
    public downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.syncFarmerConsentForms();
  }

  private syncFarmerConsentForms() {
    this.dataPrivacyService
      .getFarmerConsentForms().pipe(take(1))
      .subscribe((farmerConsentForms) => {
          this.farmerConsentForms.map(farmerConsentForm => {
            if(farmerConsentForms.length > 0) {
              const farmerConsentFormFromApi = farmerConsentForms.find(fcf => fcf.languageId === farmerConsentForm.languageId);
              farmerConsentForm.file = farmerConsentFormFromApi ? farmerConsentFormFromApi.file : null;
            } else {
              farmerConsentForm.file = null;
            }
          })
      });
  }

  public farmerConsentForms: FarmerConsentModel[] = [
    {
      language: 'English',
      languageId: 1,
      file: null,
    },
    {
      language: 'Tagalog',
      languageId: 2,
      file: null,
    },
    {
      language: 'Iloko',
      languageId: 6,
      file: null,
    },
    {
      language: 'Bisaya',
      languageId: 7,
      file: null,
    },
  ];

  public onUpload(farmerConsent: FarmerConsentModel) {
    this.dataPrivacyService
      .uploadDataPrivacy(farmerConsent)
      .subscribe((response) => {
        if (response.code === 'UPLOADED') {
          this.alertService.alert(
            'Data Privacy',
            response.message,
            'Okay',
            '',
            this.syncFarmerConsentForms.bind(this)
          );
        }

        if (response.code === 'ALREADY_EXISTS') {
          this.alertService.alert(
            'Data Privacy',
            response.message,
            'Cancel',
            'Okay',
            async () => {
              this.dataPrivacyService.updateDataPrivacy(farmerConsent).subscribe(response => {
                if(response.code === 'OVERWRITTEN') {
                  this.alertService.alert('Data Privacy',
                  response.message,
                  'Okay',
                  '',
                  this.syncFarmerConsentForms.bind(this));
                }
              });
            }
          );
        }
      });
  }

  public async onDownload(languageId: number) {
    const farmerConsentForm = this.farmerConsentForms.filter(
      (farmerConsentForm) => farmerConsentForm.languageId === languageId
    )[0];

    const fileName = "data-privacy.pdf";
    this.downloadService.downloader(farmerConsentForm.file, fileName);
  }
}
