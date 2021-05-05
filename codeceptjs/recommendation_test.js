Feature('recommendation');

Scenario('User Generate Recommendation', ({ I }) => {
    I.amOnPage('http://localhost:8100');
    I.fillField('Username', 'e.banasihan@irri.org');
    I.fillField('Password', 'testbanasihan');
    I.click('#login');
    I.wait(3);
    I.click({xpath: '//*[@id=\'4033-00006\']'});
    I.wait(2);
    I.click({xpath: '//*[@id=\'4033-013-00011\']'});
    I.wait(2);
    I.click({xpath: '//ion-button[contains(text(),\'Generate Recommendation\')]'});
    I.wait(2);
    I.click('Yes');
    I.checkOption({xpath: '//*[@formControlName=\'daProject\']/ion-item[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'fieldSeasonDescription\']/ion-item[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'fieldSeasonDescription\']/ion-item[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'isUsingPumpPoweredEquipment\']/ion-item[1]'});
    I.click({xpath:'//app-farm-lot-recommendation-form/div/form/ion-row/ion-button[1]'});

    I.checkOption({xpath: '//*[@formControlName=\'timesPlantInAYear\']/ion-item[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'establishment\']/ion-item[1]'});
    I.click({xpath: '//*[@formControlName=\'sowingDate\']'});
    I.moveCursorTo({xpath: '//*[@id="mat-datepicker-0"]/div/mat-month-view/table/tbody/tr[3]/td[6]/div[1]'});
    I.click({xpath: '//*[@id="mat-datepicker-0"]/div/mat-month-view/table/tbody/tr[3]/td[6]/div[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'seedlingAge\']/ion-item[1]'});
    I.checkOption({xpath: '//*[@formControlName=\'varietyType\']/ion-item[1]'});
    I.click({xpath: '//app-target-yield/ion-row/ion-col/form/ion-row[4]/ion-col/mat-form-field/div/div[1]/div'});
    I.moveCursorTo({xpath: '//*[@id="mat-option-145"]'});
    I.click({xpath: '//*[@id="mat-option-145"]'});
    I.fillField({xpath: '//*[@formControlName=\'noOfSacks\']/input'}, 50)
    I.fillField({xpath: '//*[@formControlName=\'weightOfSack\']/input'}, 50)
    I.checkOption({xpath: '//*[@formControlName=\'seedSource\']/ion-item[2]'})
    I.checkOption({xpath: '//*[@formControlName=\'upcomingSeasonSeedSource\']/ion-item[1]'})
    I.checkOption({xpath:'//*[@formControlName=\'recentYearsFarmLotDescription\']/ion-item[1]'})
    I.click({xpath:'//app-target-yield/ion-row/ion-col/form/ion-row[10]/ion-col/ion-button[1]'});

    I.checkOption({xpath:'//*[@formControlName=\'selectedCrop\']/ion-item[5]'});
    I.checkOption({xpath:'//*[@formControlName=\'willApplyOrganicFertilizer\']/ion-item[2]'});
    I.click({xpath: '//app-fertlizer-rates-recommendation-form/div/form/div[2]/ion-button[1]'});

    I.checkOption({xpath:'//*[@formControlName=\'nSource\']/ion-item[2]'})
    I.click({xpath: '//app-splitting-fertilizer-resources/form/ion-grid[2]/ion-row/ion-button[1]'})

    I.checkOption({xpath: '//*[@formControlName=\'applyInsecticide\']/ion-item[2]'})
    I.checkOption({xpath:'//*[@formControlName=\'preEmergence\']'})
    I.checkOption({xpath:'//*[@formControlName=\'profuseGrowth\']'})
    I.click({xpath:'//app-other-crop-management/ion-row/ion-col/ion-button[1]'})

    I.click({xpath: '//app-recommendation-summary/div/ion-row[5]/ion-col[1]/ion-button'})
    I.wait(2);
    I.click({xpath: '//*[@id="ion-overlay-3"]/div[2]/div[3]/button'});
});
