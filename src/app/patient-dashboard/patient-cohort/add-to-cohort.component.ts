import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

import { AddCohortMemberComponent } from
    '../../patient-list-cohort/cohort-member/add-cohort-member.component';

@Component({
    selector: 'add-to-cohort',
    templateUrl: 'add-to-cohort.component.html'
})

export class AddToCohortComponent implements OnInit {
    @Output()
    public dialogClosed: EventEmitter<any> = new EventEmitter();

    @Input()
    public patient: any;

    @ViewChild('addCohortComp')
    public cohortComponent: AddCohortMemberComponent;


    private _display: boolean = true;
    public get display(): boolean {
        return this._display;
    }
    public set display(v: boolean) {
        this._display = v;
        if (v === false) {
            this.dialogClosed.next();
        }
    }


    constructor() { }

    ngOnInit() {
        this.cohortComponent.showCohortSelectorComponent();
    }

    onSavedCohortMember() {
        this.display = false;
    }

    showDialog() {
        this.display = true;
    }

}
