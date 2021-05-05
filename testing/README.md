# RCM FFR Angular Unit Testing

## Running All Test
```
npm run test
```

## Testing Framework
- Jasmine

## Test Runner
- Karma

## Angular Testing Reference
[Angular Testing](https://angular.io/guide/testing)

## Testing Angular Components Steps

### Given this sample Component

```
export class ComponentClass {
    public hasCalledDataService: boolean;
    constructor(public dataService: DataService) {

    }

    ngOnInit() {
        this.hasCalledDataService = true;
        this.dataService.getCustomData();
    }
}
```

1. Desribe your test by using `describe` with your component name. 
    ```
    describe('ComponentName', () => {
        // ADD TESTING SETUP HERE
    })
    ```
2. Define your component inside the main desribe function
    ```
    import {ComponentClass} from './your/component.class.ts';
    ...
    let myComponent: ComponentClass;
    ```
3. Define component fixture
    ```
    import { ComponentFixture } from '@angular/core/testing'
    ...
    // this will simulate component being initialize as Angular Component (e.g. ngInit, etc.)
    let fixture: ComponentFixture<ComponentClass>;
    ```
4. If your component has arguments in constructor, provide mock values in `beforEach` statement
    ```
    import {of} from 'rxjs/operators';
    ...
    let dataServiceMock = {
        getCustomData: () => {
            let sampleData = [{customField: 'value'}];
            return of(sampleData);
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: dataServiceMock
                }
            ],
            declarations: [ ComponentClass ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .compileComponents();
    }));

    ```
5. Create instance of your component
    ```
    beforeEach(() => {
      fixture = TestBed.createComponent(ComponentClass);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    ```
6. Define test using `it` and assert test using `expect`
    ```
    it('should create', () => {
        expect(component).toBeTruty();
    });
    ```
