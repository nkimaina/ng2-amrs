/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

import { PatientSearchService } from './patient-search.service';
import { PatientResourceService } from "../../amrs-api/patient-resource.service";
import { Patient } from "../../models/patient.model";

describe('Service: PatientSearch', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientSearchService,
                {
                    provide: PatientResourceService, useFactory: () => {
                        return new FakePatientResourceService();;
                    }, deps: []
                }
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        let service: PatientSearchService = TestBed.get(PatientSearchService);
        expect(service).toBeTruthy();
    });

    it('should search for patients by search text', (done) => {
        let service: PatientSearchService = TestBed.get(PatientSearchService);
        let results = service.searchPatient('text');

        results.subscribe((results) => {
            expect(results).toBeTruthy();
            expect(results.length).toBeGreaterThan(0);
            expect(results[0].uuid).toEqual('uuid');
            done();
        });

    });

    it('should return an error when patient search is not successful', (done) => {
        let service: PatientSearchService = TestBed.get(PatientSearchService);
        let fakeRes: FakePatientResourceService =
         TestBed.get(PatientResourceService) as FakePatientResourceService;
        
        //tell mock to return error on next call
        fakeRes.returnErrorOnNext = true;
        let results = service.searchPatient('text');

        results.subscribe((results) => {
        },
        (error) => {
            //when it gets here, then it returned an error
            done();
        });

    });
});

/**
 * FakePatientResourceService
 */
class FakePatientResourceService extends PatientResourceService {
    constructor() {
        super();
    }
    returnErrorOnNext: boolean = false;

    searchPatient(searchText: string, cached: boolean = false, v: string = null): Observable<any> {
        let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        let patients = [
            {
                uuid: 'uuid',
                display: 'display'
            }
        ];

        if (!this.returnErrorOnNext)
            test.next(patients);
        else
            test.error(new Error('Error loading patient'));
        return test.asObservable();
    }
}