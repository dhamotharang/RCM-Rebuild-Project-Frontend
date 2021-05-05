import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactUsModel } from './models/contact-us.model';
import { ContactUsService } from './services/contact-us.service';
import { take } from 'rxjs/operators';
import { Category } from './enums/category.enum';
import {
  SoftwareRelatedSubCategory,
  SuggestionOrCommentSubCategory,
} from './enums/sub-category.enum';
import { Profession } from './enums/profession.enum';
import { ErrorModel } from '../v2/core/models/error.model';
import { ErrorLevelEnum } from '../v2/core/enums/error-level.enum';
import { AlertNotificationService } from '../v2/core/services/alert-notification.service';
import { LoaderOverlayService } from '../v2/core/services/loader-overlay.service';
import {
  mobileNumberLengthValidator,
  mobileNumberPrefixValidator,
} from 'src/app/v2/helpers/form-validator-custom.helper';
import { UserLoginModel } from '../login/models/user-login.model';
import { AuthenticationService } from '../login/services/authentication.service';
import { LocationFormModel } from '../location/models/location-form.model';
import { ConfigurationService } from '../v2/core/services/configuration.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  private loggedInUser: UserLoginModel;

  constructor(
    private contactUsService: ContactUsService,
    private alertNotificationService: AlertNotificationService,
    private loaderOverlayService: LoaderOverlayService,
    private authService: AuthenticationService,
    private configurationService: ConfigurationService
  ) {
    if (this.authService.isAuthenticated()) {
      this.loggedInUser = authService.loggedInUser;
    }
  }

  public contactUsForm = new FormGroup({
    category: new FormControl(null, Validators.required),
    subCategory: new FormControl(null),
    firstName: new FormControl(null, [
      Validators.required,
      Validators.pattern("[a-zA-Z ñÑ'.-]*"),
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.pattern("[a-zA-Z ñÑ'.-]*"),
    ]),
    profession: new FormControl(null, Validators.required),
    otherProfession: new FormControl(null),
    email: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    contactNumber: new FormControl(null, [
      Validators.required,
      Validators.pattern('0{1}9[0-9]{9}|9[0-9]{9}'),
      mobileNumberLengthValidator,
      mobileNumberPrefixValidator,
    ]),
    message: new FormControl(null, Validators.required),
    attachment: new FormControl(null),
  });

  public categoryEnum = Category;
  public softwareRelatedSubCategoryEnum = SoftwareRelatedSubCategory;
  public suggestionOrCommentSubCategoryEnum = SuggestionOrCommentSubCategory;
  public professionEnum = Profession;

  public isOtherProfessionSelected = false;

  public selectedFile = null;
  public messageTextNumber = null;
  public fileExtensions = this.configurationService.getValue('fileSizeAttachmentExt');
  private userId = null;
  public userAddress: LocationFormModel;

  ngOnInit() {
    if (this.loggedInUser) {
      this.contactUsForm.get('firstName').setValue(this.loggedInUser.firstName);
      this.contactUsForm.get('lastName').setValue(this.loggedInUser.lastName);
      this.contactUsForm.get('email').setValue(this.loggedInUser.email);
      this.contactUsForm
        .get('contactNumber')
        .setValue(this.loggedInUser.mobileNumber);
      this.userAddress = this.loggedInUser.officeAddress;
      this.userId = this.loggedInUser.userId;

      this.contactUsForm
        .get('profession')
        .setValue(this.loggedInUser.profession);

      if (this.loggedInUser.profession === Profession.OTHERS) {
        this.onProfessionChange();
        this.contactUsForm
          .get('otherProfession')
          .setValue(this.loggedInUser.otherProfession);
      }
    }
  }

  public onProfessionChange() {
    if (this.contactUsForm.get('profession').value === Profession.OTHERS) {
      this.contactUsForm
        .get('otherProfession')
        .setValidators([Validators.required]);
      this.isOtherProfessionSelected = true;
    } else {
      this.contactUsForm.get('otherProfession').clearValidators();
      this.isOtherProfessionSelected = false;
    }
    this.contactUsForm.get('otherProfession').updateValueAndValidity();
  }

  public onCategoryChange() {
    this.contactUsForm.get('subCategory').setValue(null);
    if (
      this.contactUsForm.get('category').value ===
        Category.SOFTWARE_RELATED_ISSUES ||
      this.contactUsForm.get('category').value ===
        Category.SUGGESTION_OR_COMMENT
    ) {
      this.contactUsForm
        .get('subCategory')
        .setValidators([Validators.required]);
    } else {
      this.contactUsForm.get('subCategory').clearValidators();
    }
    this.contactUsForm.get('subCategory').updateValueAndValidity();
  }

  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const fileSizeInMb = file.size / 1024 / 1024;
    if (file) {
      if (fileSizeInMb > this.configurationService.getValue('fileSizeAttachment')) {
        this.alertNotificationService.showAlert(
          'Maximum file size is 2 MB',
          'File is too large.'
        );
        this.contactUsForm.get('attachment').reset();
        this.selectedFile = null;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedFile = reader.result.toString();
        };
      }
    }
  }

  public onSubmit() {
    this.contactUsForm.markAllAsTouched();
    if (this.contactUsForm.valid) {
      this.loaderOverlayService.showOverlay();
      const contactUsModel = this.createContactUsModel();
      this.contactUsService
        .submitInquiry(contactUsModel)
        .pipe(take(1))
        .subscribe(
          data => {
            if (data) {
              this.loaderOverlayService.hideOverlay();
              this.alertNotificationService
                .showAlert(
                  'SUCCESS! Your concern was forwarded to the RCM team for review. Thank You!',
                  'Contact Us'
                )
                .then(() => {
                  this.resetForm();
                });
            }
          },
          (error: ErrorModel) => {
            if (error.level === ErrorLevelEnum.Exception) {
              this.alertNotificationService.showAlert(error.message, 'FAILED!');
            }
            this.loaderOverlayService.hideOverlay();
          }
        );
    } else {
      this.alertNotificationService.showAlert('', 'Kindly complete the form.');
    }
  }

  private resetForm() {
    this.contactUsFormReset();
    this.contactUsForm.updateValueAndValidity();
    this.selectedFile = null;
    this.isOtherProfessionSelected = false;
  }

  private contactUsFormReset() {
    if (this.loggedInUser) {
      this.contactUsForm.get('category').reset();
      this.contactUsForm.get('subCategory').reset();
      this.contactUsForm.get('profession').reset();
      this.contactUsForm.get('otherProfession').reset();
      this.contactUsForm.get('message').reset();
      this.contactUsForm.get('attachment').reset();
    } else {
      this.contactUsForm.reset();
    }
  }

  private createContactUsModel() {
    const contactUsModel: ContactUsModel = {
      category: this.contactUsForm.get('category').value,
      subCategory:
        this.contactUsForm.get('category').value ===
          Category.SOFTWARE_RELATED_ISSUES ||
        this.contactUsForm.get('category').value ===
          Category.SUGGESTION_OR_COMMENT
          ? this.contactUsForm.get('subCategory').value
          : null,
      firstName: this.contactUsForm.get('firstName').value,
      lastName: this.contactUsForm.get('lastName').value,
      profession: this.contactUsForm.get('profession').value,
      otherProfession:
        this.contactUsForm.get('profession').value === Profession.OTHERS
          ? this.contactUsForm.get('otherProfession').value
          : null,
      email: this.contactUsForm.get('email').value,
      contactNumber: this.contactUsForm.get('contactNumber').value,
      regionId: this.contactUsForm.get('region').value,
      provinceId: this.contactUsForm.get('province').value,
      municipalityId: this.contactUsForm.get('municipality').value,
      message: this.contactUsForm.get('message').value,
      attachment: this.selectedFile,
      userId: this.userId,
    };

    return contactUsModel;
  }
}
