# Rice Crop Manager (Rebuild)
Rice Crop Manager, which provides farmers with a personalized crop and nutrient management recommendation for rice fields through a one-page printout 
- DA Prod Server http://rcm.da.gov.ph/
- DA Staging Server http://121.58.207.69
- Development Server http://54.151.222.224
- Davao Dev Server http://18.141.153.8
- Jenkins Server http://13.251.35.53:8080

## Table of Contents
* Base Software Requirement
* Technologies
* Running the app
* Running the app on daily basis
* Scope of functionalities
* Android Setup
* Folder Structure
* Determining wether what you need is a page module or a page component
  - Generating Page Component
  - Generating Page Module
  - Routing 
  - Dumb Component References
* Code Review Guidelines
  - Git Guidelines
    - Rebasing
* Naming Convention
* Theming

## Base Software Requirement 
1. [Node js](https://nodejs.org/en/download/)
2. [Git](https://git-scm.com/downloads)
3. [VS Code](https://code.visualstudio.com/download)

## Technologies
1. Angular 8.1
2. Ioinic 5.4
3. Typescript 3.4

## Running the app
1. ```npm install```
2. ```npm run start```

## Scope of Functionalities
1. Generate RCM Recommendation
2. Register Farmer and Farm Lot Information
3. View Farm Lot in a Map
4. Download Farmer List
5. Track Data History
6. Print Farmer ID

## UI Development Guidelines

## Android Setup (for linux)
- Install Capacitor CLI (https://capacitorjs.com/docs/v3/getting-started)
- Install Latest Android Studio (https://developer.android.com/studio/install)
- Install Android Studio SDKs (Android Studio > File > Settings > Android SDK)
    - SDK Platforms
        - Select API level 21 to 28 (Select 29 and 30 if you have the device to test)
        - Click Apply
- Navigate to project folder
- Run the following command
    1. ```ng build```
    2. ```npx cap add android``` (do this only once)
        - on the generated android folder open android > app > src > main
        - edit the AndroidManifest.xml
        - on the ***application*** tag add ```android:usesCleartextTraffic="true"```
    3. ```npx cap copy android```
    4. ```npx cap sync android```
    5. ```npx cap open android```
- On opened Android Studio, build the apk (Android Studio > Build > Build Bundles/APks > Build APKs)
- When done, click ```locate``` on the pop up on lower right of your screen
- Copy the APK file on Your android Device
<br/>***Note for windows***
- On windows "Turn windows feature on or off" check
  - Hyper-V
  - Windows Hypervisor Platform
- ADDITIONAL SETUP FOR AMD PROCESSOR
  - Enable SVM on BIOS (Check your motherboard how to enable this)

### Folder Structure

```
    app
        core
            guards
            models
            services
        shared
            components
            pipes
        login (page - component)
        data-admin (page - module)
```

### Determining wether what you need is a page module or a page component

***Page Component***
* The page do not have child routes (e.g. login)

***Page Module***
* the page will have child routes (e.g. dashboard/add-field)

### Generating Page Component
`ng g c {page-name}`

#### sample
`ng g c login`

### Generating Page Module
`ionic g page {page-name} --routing` or `ng g m {page-name} --routing`

#### sample
`ng g m member --routing`

> Adding `--routing` param will generate a separate routing module

```
member-routing.module.ts
member.module.ts
```

### Routing

#### app-routing.module.ts
```
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'member', loadChildren: './member/member.module#MemberModule' },
  { path: 'data-admin', loadChildren: './data-admin/data-admin.module#DataAdminPageModule' },
];
```

#### ./member/member.module.ts
```
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: './member-dashboard/member-dashboard.module#MemberDashboardPageModule'
  }
];
```

### Dumb Components References
* [Angular Input and Output](https://medium.com/@foolishneo/understanding-input-output-and-eventemitter-in-angular-c1aeb9fff594)
* [Smart VS Dumb Components](https://medium.com/@jtomaszewski/how-to-write-good-composable-and-pure-components-in-angular-2-1756945c0f5b)

## Code Review Guidelines
1. Do not committed `debuggers`
2. Avoid using `any` type as much as possible
3. Avoid overwriting `ionic grid components` css
4. Be explicit and use access modifiers for class members. `public` if view will access it. Otherwise use `private`.

## Git Guidelines
1. rebase to `dev` regularly
2. create ***Pull Request*** regularly to limit line items for code review


### Rebasing

[Rebase VS Merge](https://medium.com/datadriveninvestor/git-rebase-vs-merge-cc5199edd77c)

1. `git checkout dev`
2. `git fetch`
3. `git pull`
4. `git checkout [your-branch-name]`
5. `git rebase dev`
6. if there are conflicts
    * Resolve conflicts
    * `git rebase --continue`
7. `git push`
8. if branch is now different from repo
    * `git push -f` ***WARNING!!! USE ONLY IF CERTAIN!!***


#### If something doesn't feel write
* `git rebase --abort`

### Cherry-Pick

1. `git checkout {BRANCH}` (e.g. davao)
2. `git checkout -b {NEW_BRANCH_FOR_FIXING}`
3. fix the issue, update the file and create a commit (e.g. `git commit -m "{commit-message-here}"`)
4. find the commit hash of your commit by looking in `git log`
5. go to the main branch (or branch you would like to apply the fix too) (e.g. `git checkout dev`)
6. create new branch for fixing `git checkout -b {NEW_BRANCH_FROM_DEV}`
7. `git cherry-pick {COMMIT_HASH}`
8. push the new branch to the repository `git push --set-upstream origin {NEW_BRANCH_FROM_DEV}`
9. create pull request for both branches (main branch and target branch)

## Naming Convention

1. camelCase for Variables
2. PascalCase for Class 
3. Use Suffix 'Service' for Service Name
4. Explicit Method Type (public, private)
5. Explicit Enum: JANUARY = 1, FEBRUARY = 2, MARCH = 3 not JANUARY = 1, FEBRUARY, MARCH
6. Convertion of String to Integer: Use parseInt() instead of +
7. Accessing Object Property use . instead of ['index']
8. Date Type: use Date instead of string
9. Avoid Magic Numbers use Const or Enum
10. In Multiple Answer Question, Use constant value="MANUAL" instead of value="1"

## Theming

### (Ionic)

1. Go to ionic color generator: https://ionicframework.com/docs/theming/color-generator
2. Input desired colors
3. Copy CSS Variables and Paste to global.scss (check available variables in the file)

## Improve ReadMe Document
* Update this document when additional guidelines is necessary


