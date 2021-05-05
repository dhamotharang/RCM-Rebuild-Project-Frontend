import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataPrivacyService } from 'src/app/v2/core/services/data-privacy.service';
import { DownloadService } from 'src/app/core/services/download/download.service';
import { take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { FarmerConsentLanguageModel } from 'src/app/core/models/farmer-consent-language.model';

const DEFAULT_LANGUAGE_ID = 1;
@Component({
  selector: 'app-data-privacy',
  templateUrl: './farmer-data-privacy.component.html',
  styleUrls: ['./farmer-data-privacy.component.scss'],
})
export class FarmerDataPrivacyComponent implements OnInit {

  constructor(private modalController: ModalController,
    private dataPrivacyService: DataPrivacyService,
    private router: Router,
    public downloadService: DownloadService,
    private alertService: AlertService
    ) { }

  ngOnInit() { }

  @Input() public viewOnly: boolean = true;
  public farmerConsentLanguages: FarmerConsentLanguageModel[] = [
    {
      id: 1,
      label: 'English'
    },
    {
      id: 2,
      label: 'Tagalog'
    },
    {
      id: 6,
      label: 'Iloko'
    },
    {
      id: 7,
      label: 'Bisaya'
    },
  ];

  public closeModal() {
    this.modalController.dismiss();
  }

  public accept() {
    this.modalController.dismiss();
    this.router.navigate(['/data-admin/farmer-management/add-farmer']);
  }

  public download() {
    this.modalController.dismiss();
    this.dataPrivacyService.getDataPrivacyDocument(this.languageId).pipe(take(1)).subscribe(farmerConsentModel => {
      if (farmerConsentModel) {
        const fileName = "data-privacy.pdf";
        this.downloadService.downloader(farmerConsentModel.file, fileName);
      }
    }, (error: HttpErrorResponse) => {
      if(error.status === 404) {
        this.alertService.alert('Unable to download', 'Data privacy file does not exist in the database! Please contact the admin.', 'Okay', '', false)
      }
    });

    if (!this.viewOnly) {
      this.router.navigate(['/data-admin/farmer-management/add-farmer']);
    }
  }

  public readonly DEFAULT_LANGUAGE_ID = DEFAULT_LANGUAGE_ID;
  public languageId: number = DEFAULT_LANGUAGE_ID;
  public onSelectLanguage(event: CustomEvent) {
    this.languageId = event.detail.value;
  }
}
