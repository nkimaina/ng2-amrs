import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject} from 'rxjs/Rx';

import { PatientResourceService } from "../../amrs-api/patient-resource.service";
import { Patient } from "../../models/patient.model";

@Injectable()
export class PatientSearchService {

    constructor(private resouceService: PatientResourceService) {

    }

    searchPatient(searchText: string): Observable<Patient[]> {
        let subject: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

        let patientsObservable = this.resouceService.searchPatient('some string');

        patientsObservable.subscribe(
            (patients) => {
                let mappedPatients:Patient[] = new Array<Patient>();

                for(let i = 0; i < patients.length; i++) {
                    mappedPatients.push(new Patient(patients[i]));
                }

                subject.next(mappedPatients);
            },
            (error) => {
                subject.error(error); //TODO: test case that returns error
            }
        );

        return subject.asObservable();
    }

}