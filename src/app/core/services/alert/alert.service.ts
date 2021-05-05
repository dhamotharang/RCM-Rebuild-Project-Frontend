import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AlertButton } from '@ionic/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;

    constructor(
        private router: Router,
        public alertController: AlertController
    ) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'error', text: message });
    }

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }

    public async alert(header, message, buttonText1, buttonText2, method) {

        let button1: string | AlertButton;
        let button2: string | AlertButton;
        let buttonContent: any;

        if (buttonText1 && buttonText2) {
            button1 = {
                text: buttonText1,
                role: 'cancel'
            };
            
            button2 = {
                text: buttonText2,
                handler: () => {
                    if (method && typeof method === "function") {
                        const callback = method || (() => { });
                        return callback();
                    }
                }
            };

            buttonContent = [button1, button2];
            
        } else {
            button1 = {
                text: buttonText1,
                handler: () => {
                    if (method && typeof method === "function") {
                        const callback = method || (() => { });
                        return callback();
                    }
                }
            };

            buttonContent = [button1];
        }

        let alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: buttonContent
        });
        
        await alert.present();
        
    }
}