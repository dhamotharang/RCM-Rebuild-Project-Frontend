import {Component, Input, OnInit} from '@angular/core';
import { ConfigurationService } from '../../../core/services/configuration.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() public page = '';
    @Input() public version;
    public mobilePageAndVersion: string;
    public desktopPageAndVersion: string;

    constructor(private configurationService: ConfigurationService) {
    }

    ngOnInit() {
        const separatorForMobile = '<br>';
        const separatorForDesktop = ' | ';
        this.version = this.configurationService.getValue('version');
        this.mobilePageAndVersion = this.formatText(this.page, this.version, separatorForMobile);
        this.desktopPageAndVersion = this.formatText(this.page, this.version, separatorForDesktop);
    }

    private formatText(page: string, version: string, separator: string) {
        let formatText = '';
        if (!!page) {
            formatText += separator + this.page;
        }
        if (!!version) {
            formatText += separator + this.version;
        }
        return formatText;
    }

}
