import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'cohort-selector',
    templateUrl: 'cohort-selector.component.html'
})

export class CohortSelectorComponent implements OnInit {

    @Output()
    public cohortSelected: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    selectCohort(cohort) {
        this.cohortSelected.next({
            display: 'different',
            uuid: 'a8d586ac-018e-40b6-8778-87b09d762c06'
        });
    }
}
