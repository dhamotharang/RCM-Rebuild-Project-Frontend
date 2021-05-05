import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { PotentialYieldModel } from 'src/app/recommendation/model/potential-yield.model';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../v2/core/services/error.service';
import {PotentialYieldStorageService} from '../../offline-management/services/potential-yield-storage.service';

@Injectable({
    providedIn: 'root'
})
export class DataPotentialYieldService implements OnInit {
    public apiurl = environment.anPotentialYieldApi;

    public potentialYieldList: PotentialYieldModel[];

    constructor(
        private http: HttpClient,
        private dataPotentialYieldStorage: PotentialYieldStorageService,
        private errorService: ErrorService
    ) {
    }

    ngOnInit() { }

    queryByRunIdSowingMonthGrowthDuration(runId: number, sowingMonth: number, growthDuration: number) {


        const filterPotentialYieldList = this.potentialYieldList.filter(function (py) {

            const sowingMonthToNumber = +py.sowingMonth; // ensure that sowingMonth is in number Format
            const growthDurationToNumber = +py.growthDuration; // ensure that growthDuration is in number Format

            const isRunIdMatched = (py.runId === runId);
            const isSowingMonthMatched = (sowingMonthToNumber === sowingMonth);
            const isGrowthDurationMatched = (growthDurationToNumber === growthDuration);

            const potentialYieldMatch = (isRunIdMatched && isSowingMonthMatched && isGrowthDurationMatched);

            return potentialYieldMatch;
        });

        const potentialYieldListResult = filterPotentialYieldList[0];

        return potentialYieldListResult;
    }

    public async loadPotentialYield(): Promise<void> {
        this.potentialYieldList = await this.dataPotentialYieldStorage.getPotentialYieldData();

        if (!this.potentialYieldList || this.potentialYieldList.length <= 0) {
            return this.http.get<PotentialYieldModel[]>(this.apiurl).pipe(
                map(potentialYield => {
                    this.potentialYieldList = potentialYield.map(this.mappingFunction);
                }),
                catchError(this.errorService.handleError('DataPotentialYieldService', 'getPotentialYieldApi'))
            )
                .toPromise();
        }
        return Promise.resolve();
    }

    private mappingFunction(potentialYield) {
        return {
            potentialId: potentialYield.potential_id,
            runId: potentialYield.run_id,
            sowingMonth: potentialYield.sowing_month,
            growthDuration: potentialYield.growth_duration,
            hybrid80: potentialYield.hybrid_80,
            hybrid75: potentialYield.hybrid_75,
            hybrid70: potentialYield.hybrid_70,
            inbred70: potentialYield.inbred_70,
            inbred65: potentialYield.inbred_65,
            inbred60: potentialYield.inbred_60,
        };
    }

    public getPotentialYieldApi() {
        return this.http.get<PotentialYieldModel[]>(this.apiurl).pipe(
            map(potentialYield => {
                return potentialYield.map(this.mappingFunction);
            }),
            catchError(this.errorService.handleError('DataPotentialYieldService', 'getPotentialYieldApi'))
        );
    }

}
